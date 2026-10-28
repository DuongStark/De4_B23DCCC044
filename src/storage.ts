import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import type { RestaurantData } from './types.ts';
import { isRestaurantData } from './utils/validation.ts';

const storage = createAsyncStorage('restaurantDB');
const STORAGE_KEY = '@restaurant_app/data_v1';
let writeQueue: Promise<void> = Promise.resolve();

export async function loadRestaurant(): Promise<RestaurantData | null> {
  const raw = await storage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!isRestaurantData(parsed)) throw new Error('Dữ liệu lưu không hợp lệ.');
  return parsed;
}
export function saveRestaurant(data: RestaurantData): Promise<void> {
  const json = JSON.stringify(data);
  // Chờ lần ghi trước xong để bấm +/- nhanh vẫn lưu đúng trạng thái cuối.
  const currentWrite = writeQueue.then(() =>
    storage.setItem(STORAGE_KEY, json),
  );
  // Bắt lỗi cho hàng đợi tiếp tục; người gọi vẫn nhận lỗi của currentWrite.
  writeQueue = currentWrite.catch(() => {});
  return currentWrite;
}
