export const CATEGORIES = [
  'Khai vị',
  'Món chính',
  'Tráng miệng',
  'Đồ uống',
] as const;
export type Category = (typeof CATEGORIES)[number];
export type Dish = {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
};
export type InvoiceItem = { dishId: string; quantity: number };
export type Invoice = {
  id: string;
  tableNumber: number;
  items: InvoiceItem[];
  status: 'Đang phục vụ' | 'Đã thanh toán';
  createdAt: string;
};
export type RestaurantData = { dishes: Dish[]; invoices: Invoice[] };
export type DishInput = { name: string; price: string; category: Category };
export type DishErrors = { name?: string; price?: string };
export type ActionResult = { ok: true } | { ok: false; error: string };
export type InvoiceLine = {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};
export type InvoiceDetails = {
  lines: InvoiceLine[];
  subtotal: number;
  vat: number;
  total: number;
};
export type RootStackParamList = {
  Menu: undefined;
  DishForm: { dishId?: string };
  Tables: undefined;
  Order: { tableNumber: number };
  Payment: { invoiceId: string };
};
