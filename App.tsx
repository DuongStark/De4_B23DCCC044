import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type {
  ActionResult,
  DishInput,
  RestaurantData,
  RootStackParamList,
} from './src/types';
import { colors, common } from './src/theme/colors';
import { createInitialData } from './src/data/initialData';
import { loadRestaurant, saveRestaurant } from './src/storage';
import {
  changeQuantityData,
  deleteDishData,
  payInvoiceData,
  saveDishData,
} from './src/utils/restaurant';
import AppButton from './src/components/AppButton';
import MenuScreen from './src/screens/MenuScreen';
import DishFormScreen from './src/screens/DishFormScreen';
import TablesScreen from './src/screens/TablesScreen';
import OrderScreen from './src/screens/OrderScreen';
import PaymentScreen from './src/screens/PaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  // Dữ liệu dùng chung chỉ ở đây. null = chưa tải, khác với thực đơn rỗng.
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>(
    'saving',
  );
  const [retrySave, setRetrySave] = useState(0);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  // ref đọc dữ liệu mới nhất kể cả khi callback Alert được mở từ trước.
  const dataRef = useRef<RestaurantData | null>(null);
  const lastSavedRef = useRef<RestaurantData | null>(null);
  // Khóa ngay lập tức, không chờ React render, để chống bấm trả tiền hai lần.
  const paymentLockRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    async function load() {
      try {
        const stored = await loadRestaurant();
        if (cancelled) return;
        const initial = stored ?? createInitialData();
        if (stored) lastSavedRef.current = stored;
        dataRef.current = initial;
        setData(initial);
        setSaveStatus(stored ? 'saved' : 'saving');
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  useEffect(() => {
    // Không lưu state chưa tải hoặc snapshot cũ trong lúc thanh toán.
    if (!data || paymentLockRef.current || lastSavedRef.current === data)
      return;
    let cancelled = false;
    setSaveStatus('saving');
    saveRestaurant(data)
      .then(() => {
        if (!cancelled) {
          lastSavedRef.current = data;
          setSaveStatus('saved');
        }
      })
      .catch(() => {
        if (!cancelled) setSaveStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [data, retrySave, paymentInProgress]);

  function updateData(next: RestaurantData) {
    dataRef.current = next;
    setData(next);
  }
  function changeData(
    transform: (current: RestaurantData) => RestaurantData,
  ): ActionResult {
    if (paymentLockRef.current)
      return {
        ok: false,
        error: 'Đang lưu thanh toán. Vui lòng chờ một chút.',
      };
    if (!dataRef.current) return { ok: false, error: 'Dữ liệu chưa tải xong.' };
    try {
      updateData(transform(dataRef.current));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Thao tác chưa thực hiện được.',
      };
    }
  }
  function saveDish(input: DishInput, id?: string) {
    return changeData(current => saveDishData(current, input, id));
  }
  function deleteDish(id: string) {
    return changeData(current => deleteDishData(current, id));
  }
  function changeQuantity(
    table: number,
    id: string,
    delta: 1 | -1,
  ): ActionResult {
    const current = dataRef.current;
    if (paymentLockRef.current || !current)
      return { ok: false, error: 'Vui lòng chờ xử lý dữ liệu.' };
    const invoice = current.invoices.find(
      i => i.tableNumber === table && i.status === 'Đang phục vụ',
    );
    const item = invoice?.items.find(i => i.dishId === id);
    const apply = () =>
      changeData(latest => changeQuantityData(latest, table, id, delta));
    // Kiểm tra ref thay vì props cũ: bấm giảm nhanh vẫn phải xác nhận món cuối.
    if (delta === -1 && item?.quantity === 1) {
      const dish = current.dishes.find(d => d.id === id);
      const lastItem = invoice?.items.length === 1;
      Alert.alert(
        'Bỏ món khỏi hóa đơn?',
        `Bỏ “${dish?.name ?? 'món này'}”?${
          lastItem ? ' Bàn sẽ trở về trạng thái trống.' : ''
        }`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Bỏ món',
            style: 'destructive',
            onPress: () => {
              const result = apply();
              if (!result.ok) Alert.alert('Chưa thể bỏ món', result.error);
            },
          },
        ],
      );
      return { ok: true };
    }
    return apply();
  }
  function toggleDish(id: string) {
    return changeData(current => {
      if (!current.dishes.some(d => d.id === id))
        throw new Error('Món ăn không còn tồn tại.');
      return {
        ...current,
        dishes: current.dishes.map(d =>
          d.id === id ? { ...d, available: !d.available } : d,
        ),
      };
    });
  }
  async function payInvoice(
    id: string,
    received: number,
  ): Promise<ActionResult> {
    if (paymentLockRef.current || !dataRef.current)
      return { ok: false, error: 'Thanh toán đang được xử lý.' };
    paymentLockRef.current = true;
    setPaymentInProgress(true);
    try {
      const next = payInvoiceData(dataRef.current, id, received);
      // Riêng thanh toán phải lưu xong mới đổi UI/báo thành công.
      await saveRestaurant(next);
      lastSavedRef.current = next;
      updateData(next);
      setSaveStatus('saved');
      return { ok: true };
    } catch {
      return {
        ok: false,
        error:
          'Chưa thể thanh toán hoặc lưu hóa đơn. Kiểm tra tiền khách đưa và thử lại.',
      };
    } finally {
      paymentLockRef.current = false;
      setPaymentInProgress(false);
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {!data ? (
        <SafeAreaView style={[common.screen, styles.center]}>
          {loadError ? (
            <>
              <Text style={common.title}>Chưa tải được dữ liệu</Text>
              <Text style={styles.message}>
                Dữ liệu hiện có vẫn được giữ nguyên. Vui lòng thử lại.
              </Text>
              <AppButton
                title="Thử tải lại"
                onPress={() => setReload(value => value + 1)}
              />
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={common.muted}>Đang chuẩn bị nhà hàng…</Text>
            </>
          )}
        </SafeAreaView>
      ) : (
        <View style={styles.root}>
          {saveStatus === 'error' && (
            <SafeAreaView
              edges={['top', 'left', 'right']}
              style={styles.saveError}
            >
              <Text style={common.error}>
                Chưa lưu được thay đổi. Hãy thử lại trước khi đóng ứng dụng.
              </Text>
              <AppButton
                title="Thử lưu lại"
                variant="secondary"
                onPress={() => setRetrySave(value => value + 1)}
              />
            </SafeAreaView>
          )}
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
              screenOptions={{
                headerTintColor: colors.primary,
                headerTitleStyle: { fontSize: 18, fontWeight: '700' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="Menu" options={{ title: 'Thực đơn' }}>
                {props => (
                  <MenuScreen
                    {...props}
                    {...data}
                    onToggle={toggleDish}
                    onDelete={deleteDish}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="DishForm"
                options={({ route }) => ({
                  title: route.params.dishId ? 'Sửa món' : 'Thêm món',
                })}
              >
                {props => (
                  <DishFormScreen
                    {...props}
                    dishes={data.dishes}
                    onSave={saveDish}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Tables" options={{ title: 'Sơ đồ bàn' }}>
                {props => <TablesScreen {...props} {...data} />}
              </Stack.Screen>
              <Stack.Screen
                name="Order"
                options={({ route }) => ({
                  title: `Bàn ${route.params.tableNumber} · Gọi món`,
                })}
              >
                {props => (
                  <OrderScreen
                    {...props}
                    {...data}
                    onChangeQuantity={changeQuantity}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Payment"
                options={{
                  title: 'Thanh toán',
                  gestureEnabled: !paymentInProgress,
                  headerBackVisible: !paymentInProgress,
                }}
              >
                {props => (
                  <PaymentScreen
                    {...props}
                    {...data}
                    paymentInProgress={paymentInProgress}
                    onPay={payInvoice}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
          <SafeAreaView edges={['bottom']} style={styles.saveBar}>
            <Text style={styles.saveText}>
              {paymentInProgress
                ? 'Đang lưu thanh toán…'
                : saveStatus === 'saving'
                ? 'Đang lưu thay đổi…'
                : saveStatus === 'error'
                ? 'Có thay đổi chưa lưu'
                : 'Đã lưu trên thiết bị'}
            </Text>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: 'center',
  },
  saveError: {
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  saveBar: {
    backgroundColor: colors.surface,
    paddingTop: 4,
    alignItems: 'center',
  },
  saveText: { fontSize: 11, color: colors.muted, paddingBottom: 4 },
});
