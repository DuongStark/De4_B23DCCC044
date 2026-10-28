import type { DishInput, RestaurantData } from '../types.ts';
import { CATEGORIES } from '../types.ts';
import { createId, formatCreatedAt } from './format.ts';
import { getActiveInvoice, getInvoiceDetails } from './invoices.ts';
import { validateDish } from './validation.ts';

// Các hàm tạo dữ liệu mới, không sửa object cũ và không tự lưu xuống máy.
export function saveDishData(
  data: RestaurantData,
  input: DishInput,
  editingId?: string,
): RestaurantData {
  const errors = validateDish(input, data.dishes, editingId);
  if (errors.name || errors.price) throw new Error(errors.name || errors.price);
  if (!CATEGORIES.includes(input.category))
    throw new Error('Loại món không hợp lệ.');
  if (editingId && !data.dishes.some(d => d.id === editingId))
    throw new Error('Món ăn không còn tồn tại.');
  const fields = {
    name: input.name.trim(),
    price: Number(input.price),
    category: input.category,
  };
  const dishes = editingId
    ? data.dishes.map(d => (d.id === editingId ? { ...d, ...fields } : d))
    : [...data.dishes, { ...fields, id: createId('dish'), available: true }];
  return { ...data, dishes };
}
export function deleteDishData(
  data: RestaurantData,
  dishId: string,
): RestaurantData {
  if (
    data.invoices.some(
      i =>
        i.status === 'Đang phục vụ' &&
        i.items.some(item => item.dishId === dishId),
    )
  )
    throw new Error('Món đang có trong hóa đơn đang phục vụ, chưa thể xóa.');
  if (!data.dishes.some(d => d.id === dishId))
    throw new Error('Món ăn không còn tồn tại.');
  return { ...data, dishes: data.dishes.filter(d => d.id !== dishId) };
}
export function changeQuantityData(
  data: RestaurantData,
  tableNumber: number,
  dishId: string,
  delta: 1 | -1,
): RestaurantData {
  if (!Number.isInteger(tableNumber) || tableNumber < 1 || tableNumber > 10)
    throw new Error('Số bàn không hợp lệ.');
  if (delta !== 1 && delta !== -1) throw new Error('Thao tác không hợp lệ.');
  const dish = data.dishes.find(d => d.id === dishId);
  if (!dish) throw new Error('Món ăn không còn tồn tại.');
  if (delta === 1 && !dish.available)
    throw new Error('Món đã hết, không thể gọi thêm.');
  const invoice = getActiveInvoice(data.invoices, tableNumber);
  if (!invoice) {
    if (delta === -1) throw new Error('Bàn chưa gọi món này.');
    return {
      ...data,
      invoices: [
        ...data.invoices,
        {
          id: createId('invoice'),
          tableNumber,
          items: [{ dishId, quantity: 1 }],
          status: 'Đang phục vụ',
          createdAt: formatCreatedAt(new Date()),
        },
      ],
    };
  }
  const item = invoice.items.find(i => i.dishId === dishId);
  if (!item && delta === -1) throw new Error('Bàn chưa gọi món này.');
  const quantity = (item?.quantity ?? 0) + delta;
  const items = item
    ? invoice.items
        .map(i => (i.dishId === dishId ? { ...i, quantity } : i))
        .filter(i => i.quantity > 0)
    : [...invoice.items, { dishId, quantity }];
  // Khi bỏ món cuối, bỏ luôn hóa đơn nháp rỗng để bàn không bị giữ chỗ.
  const invoices =
    items.length === 0
      ? data.invoices.filter(i => i.id !== invoice.id)
      : data.invoices.map(i => (i.id === invoice.id ? { ...i, items } : i));
  return { ...data, invoices };
}
export function payInvoiceData(
  data: RestaurantData,
  invoiceId: string,
  received: number,
): RestaurantData {
  const invoice = data.invoices.find(i => i.id === invoiceId);
  if (!invoice || invoice.status !== 'Đang phục vụ')
    throw new Error('Hóa đơn không còn đang phục vụ.');
  const details = getInvoiceDetails(invoice, data.dishes);
  if (!details || details.lines.length === 0)
    throw new Error('Hóa đơn chưa có món hoặc dữ liệu món không hợp lệ.');
  if (!Number.isSafeInteger(received) || received < details.total)
    throw new Error('Tiền khách đưa chưa đủ hoặc không hợp lệ.');
  return {
    ...data,
    invoices: data.invoices.map(i =>
      i.id === invoiceId ? { ...i, status: 'Đã thanh toán' } : i,
    ),
  };
}
