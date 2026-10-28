import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RestaurantData, RootStackParamList } from '../types';
import { colors, common } from '../theme/colors';
import {
  countOccupiedTables,
  getActiveInvoice,
  getInvoiceDetails,
} from '../utils/invoices';
import { formatMoney } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Tables'> &
  RestaurantData;
const TABLES = Array.from({ length: 10 }, (_, index) => index + 1);
export default function TablesScreen({ navigation, dishes, invoices }: Props) {
  return (
    <SafeAreaView style={common.screen} edges={['left', 'right']}>
      <FlatList
        data={TABLES}
        numColumns={2}
        keyExtractor={item => String(item)}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Chọn bàn phục vụ</Text>
            <Text style={common.muted}>
              {countOccupiedTables(invoices)}/10 bàn đang phục vụ · Chạm bàn để
              gọi món
            </Text>
            <View style={styles.legend}>
              <Text style={styles.emptyLabel}>○ Bàn trống</Text>
              <Text style={styles.activeLabel}>● Có khách</Text>
            </View>
          </View>
        }
        renderItem={({ item: tableNumber }) => {
          const invoice = getActiveInvoice(invoices, tableNumber);
          const details = invoice ? getInvoiceDetails(invoice, dishes) : null;
          const quantity =
            invoice?.items.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Bàn ${tableNumber}, ${
                invoice ? 'đang phục vụ' : 'trống'
              }`}
              onPress={() => navigation.navigate('Order', { tableNumber })}
              style={({ pressed }) => [
                common.card,
                styles.table,
                invoice && styles.occupied,
                pressed && common.pressed,
              ]}
            >
              <Text style={[styles.tableNumber, invoice && styles.activeText]}>
                Bàn {String(tableNumber).padStart(2, '0')}
              </Text>
              <Text style={[styles.status, invoice && styles.activeText]}>
                {invoice ? 'Đang phục vụ' : 'Sẵn sàng đón khách'}
              </Text>
              <View style={styles.divider} />
              <Text style={common.muted}>
                {invoice ? `${quantity} phần món` : 'Chưa gọi món'}
              </Text>
              <Text style={[styles.total, invoice && styles.activeText]}>
                {invoice && details ? formatMoney(details.subtotal) : 'Trống'}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 24 },
  row: { gap: 12 },
  header: { gap: 12, marginBottom: 20 },
  heading: { fontSize: 26, fontWeight: '800', color: colors.text },
  legend: { flexDirection: 'row', gap: 20, marginTop: 4 },
  emptyLabel: { color: colors.muted, fontSize: 14 },
  activeLabel: { color: colors.success, fontSize: 14 },
  table: { flex: 1, marginBottom: 12, gap: 8, minHeight: 164 },
  occupied: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successBorder,
  },
  tableNumber: { fontSize: 22, fontWeight: '800', color: colors.text },
  status: { fontSize: 13, color: colors.muted },
  activeText: { color: colors.success },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  total: { fontSize: 17, fontWeight: '700', color: colors.muted },
});
