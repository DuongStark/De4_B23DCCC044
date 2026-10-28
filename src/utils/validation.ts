import { CATEGORIES } from '../types.ts';
import type { Dish, DishInput, DishErrors, RestaurantData } from '../types.ts';
import { parseMoneyInput } from './format.ts';

export function validateDish(
  input: DishInput,
  dishes: Dish[],
  editingId?: string,
): DishErrors {
  const errors: DishErrors = {};
  const name = input.name.trim().toLowerCase();
  if (!name) errors.name = 'Vui lòng nhập tên món.';
  else if (
    dishes.some(d => d.id !== editingId && d.name.trim().toLowerCase() === name)
  )
    errors.name = 'Tên món đã tồn tại.';
  const price = parseMoneyInput(input.price);
  if (price === null || price <= 0 || price % 1000 !== 0)
    errors.price = 'Giá phải là số dương và là bội của 1.000 đ.';
  return errors;
}

// JSON đọc từ máy vẫn cần kiểm tra trước khi dùng, tránh dữ liệu hỏng làm crash.
export function isRestaurantData(value: unknown): value is RestaurantData {
  if (
    !value ||
    typeof value !== 'object' ||
    !('dishes' in value) ||
    !('invoices' in value)
  )
    return false;
  const { dishes, invoices } = value;
  if (!Array.isArray(dishes) || !Array.isArray(invoices)) return false;
  const dishIds = new Set<string>();
  const names = new Set<string>();
  for (const d of dishes) {
    if (
      !d ||
      typeof d.id !== 'string' ||
      !d.id ||
      typeof d.name !== 'string' ||
      !d.name.trim() ||
      !CATEGORIES.includes(d.category) ||
      !Number.isSafeInteger(d.price) ||
      d.price <= 0 ||
      d.price % 1000 !== 0 ||
      typeof d.available !== 'boolean'
    )
      return false;
    const name = d.name.trim().toLowerCase();
    if (dishIds.has(d.id) || names.has(name)) return false;
    dishIds.add(d.id);
    names.add(name);
  }
  const invoiceIds = new Set<string>();
  const activeTables = new Set<number>();
  for (const invoice of invoices) {
    if (
      !invoice ||
      typeof invoice.id !== 'string' ||
      !invoice.id ||
      invoiceIds.has(invoice.id) ||
      !Number.isInteger(invoice.tableNumber) ||
      invoice.tableNumber < 1 ||
      invoice.tableNumber > 10 ||
      !['Đang phục vụ', 'Đã thanh toán'].includes(invoice.status) ||
      typeof invoice.createdAt !== 'string' ||
      !/^\d{2}:\d{2} \d{2}\/\d{2}\/\d{4}$/.test(invoice.createdAt) ||
      !Array.isArray(invoice.items)
    )
      return false;
    invoiceIds.add(invoice.id);
    const active = invoice.status === 'Đang phục vụ';
    if (
      active &&
      (activeTables.has(invoice.tableNumber) || invoice.items.length === 0)
    )
      return false;
    if (active) activeTables.add(invoice.tableNumber);
    const itemIds = new Set<string>();
    for (const item of invoice.items) {
      if (
        !item ||
        typeof item.dishId !== 'string' ||
        !item.dishId ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        itemIds.has(item.dishId) ||
        (active && !dishIds.has(item.dishId))
      )
        return false;
      itemIds.add(item.dishId);
    }
  }
  return true;
}
