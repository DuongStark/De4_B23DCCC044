import type { RestaurantData } from '../types.ts';
import { formatCreatedAt } from '../utils/format.ts';

export function createInitialData(): RestaurantData {
  return {
    dishes: [
      {
        id: 'seed-1',
        name: 'Gỏi cuốn tôm thịt',
        category: 'Khai vị',
        price: 30000,
        available: true,
      },
      {
        id: 'seed-2',
        name: 'Súp nấm',
        category: 'Khai vị',
        price: 25000,
        available: true,
      },
      {
        id: 'seed-3',
        name: 'Cơm gà sốt nấm',
        category: 'Món chính',
        price: 45000,
        available: true,
      },
      {
        id: 'seed-4',
        name: 'Bò xào rau củ',
        category: 'Món chính',
        price: 75000,
        available: true,
      },
      {
        id: 'seed-5',
        name: 'Chè hạt sen',
        category: 'Tráng miệng',
        price: 20000,
        available: true,
      },
      {
        id: 'seed-6',
        name: 'Bánh flan',
        category: 'Tráng miệng',
        price: 15000,
        available: true,
      },
      {
        id: 'seed-7',
        name: 'Trà đào cam sả',
        category: 'Đồ uống',
        price: 25000,
        available: true,
      },
      {
        id: 'seed-8',
        name: 'Nước suối',
        category: 'Đồ uống',
        price: 10000,
        available: true,
      },
    ],
    invoices: [
      {
        id: 'seed-invoice',
        tableNumber: 1,
        items: [
          { dishId: 'seed-3', quantity: 2 },
          { dishId: 'seed-7', quantity: 1 },
        ],
        status: 'Đang phục vụ',
        createdAt: formatCreatedAt(new Date()),
      },
    ],
  };
}
