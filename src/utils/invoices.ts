import type { Dish, Invoice, InvoiceDetails } from '../types.ts';

export const VAT_RATE = 0.08;
export function getActiveInvoice(
  invoices: Invoice[],
  tableNumber: number,
): Invoice | undefined {
  return invoices.find(
    invoice =>
      invoice.tableNumber === tableNumber && invoice.status === 'Đang phục vụ',
  );
}
export function countOccupiedTables(invoices: Invoice[]): number {
  return new Set(
    invoices.filter(i => i.status === 'Đang phục vụ').map(i => i.tableNumber),
  ).size;
}
export function getInvoiceDetails(
  invoice: Invoice,
  dishes: Dish[],
): InvoiceDetails | null {
  const lines = [];
  for (const item of invoice.items) {
    const dish = dishes.find(d => d.id === item.dishId);
    if (!dish) return null;
    lines.push({
      dishId: dish.id,
      name: dish.name,
      quantity: item.quantity,
      unitPrice: dish.price,
      lineTotal: dish.price * item.quantity,
    });
  }
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  return { lines, subtotal, vat, total: subtotal + vat };
}
