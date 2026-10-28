import React from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CATEGORIES } from '../types';
import type {
  ActionResult,
  Dish,
  RestaurantData,
  RootStackParamList,
} from '../types';
import { colors, common } from '../theme/colors';
import { getActiveInvoice, getInvoiceDetails } from '../utils/invoices';
import { formatMoney } from '../utils/format';
import DishCard from '../components/DishCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Order'> &
  RestaurantData & {
    onChangeQuantity: (
      table: number,
      id: string,
      delta: 1 | -1,
    ) => ActionResult;
  };
export default function OrderScreen({
  navigation,
  route,
  dishes,
  invoices,
  onChangeQuantity,
}: Props) {
  const tableNumber = route.params.tableNumber;
  const invoice = getActiveInvoice(invoices, tableNumber);
  const details = invoice ? getInvoiceDetails(invoice, dishes) : null;
  const totalQuantity =
    invoice?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const sections = CATEGORIES.map(title => ({
    title,
    data: dishes.filter(d => d.category === title),
  })).filter(s => s.data.length > 0);
  function change(dish: Dish, delta: 1 | -1) {
    // App xác nhận khi số lượng mới nhất là 1, tránh props cũ khi bấm nhanh.
    const result = onChangeQuantity(tableNumber, dish.id, delta);
    if (!result.ok) Alert.alert('Chưa thể đổi số lượng', result.error);
  }
  return (
    <SafeAreaView style={common.screen} edges={['left', 'right']}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>
              BÀN {String(tableNumber).padStart(2, '0')}
            </Text>
            <Text style={common.title}>Chọn món cho bữa ngon</Text>
            <Text style={common.muted}>
              {totalQuantity
                ? `Đã chọn ${totalQuantity} phần món`
                : 'Bấm + để thêm món vào hóa đơn.'}
            </Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            mode="order"
            quantity={
              invoice?.items.find(i => i.dishId === item.id)?.quantity ?? 0
            }
            onIncrease={() => change(item, 1)}
            onDecrease={() => change(item, -1)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có món để gọi"
            description="Trở về thực đơn để thêm món trước."
          />
        }
      />
      <View style={styles.footer}>
        <View style={common.row}>
          <View>
            <Text style={common.muted}>Tạm tính · chưa VAT</Text>
            <Text style={styles.total}>
              {formatMoney(details?.subtotal ?? 0)}
            </Text>
          </View>
          <Text style={common.muted}>{totalQuantity} phần</Text>
        </View>
        <AppButton
          title={totalQuantity ? 'Tiếp tục thanh toán' : 'Chưa chọn món'}
          disabled={!details || details.lines.length === 0}
          onPress={() => {
            if (invoice)
              navigation.navigate('Payment', { invoiceId: invoice.id });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16 },
  header: { gap: 8, marginBottom: 16 },
  eyebrow: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  footer: {
    backgroundColor: colors.surface,
    padding: 16,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  total: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
});
