import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePreventRemove } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  ActionResult,
  RestaurantData,
  RootStackParamList,
} from '../types';
import { colors, common } from '../theme/colors';
import { getInvoiceDetails } from '../utils/invoices';
import { formatMoney, parseMoneyInput } from '../utils/format';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'> &
  RestaurantData & {
    paymentInProgress: boolean;
    onPay: (id: string, received: number) => Promise<ActionResult>;
  };
export default function PaymentScreen({
  navigation,
  route,
  dishes,
  invoices,
  paymentInProgress,
  onPay,
}: Props) {
  usePreventRemove(paymentInProgress, () => {
    Alert.alert('Đang thanh toán', 'Vui lòng chờ lưu hóa đơn xong.');
  });
  const [receivedText, setReceivedText] = useState('');
  const headerHeight = useHeaderHeight();
  const invoice = invoices.find(i => i.id === route.params.invoiceId);
  const details = invoice ? getInvoiceDetails(invoice, dishes) : null;
  const received = parseMoneyInput(receivedText);
  const canPay =
    !!invoice &&
    invoice.status === 'Đang phục vụ' &&
    !!details &&
    details.lines.length > 0 &&
    received !== null &&
    received >= details.total;
  const goToTables = () => navigation.popTo('Tables');
  async function pay() {
    if (
      !canPay ||
      received === null ||
      !invoice ||
      !details ||
      paymentInProgress
    )
      return;
    const change = received - details.total;
    const result = await onPay(invoice.id, received);
    if (!result.ok) {
      Alert.alert('Chưa thanh toán được', result.error);
      return;
    }
    Alert.alert(
      'Thanh toán thành công',
      `Tiền thừa: ${formatMoney(change)}`,
      [{ text: 'Về sơ đồ bàn', onPress: goToTables }],
      { cancelable: false },
    );
  }
  // Khi root chuyển paid, giữ khung màn cho tới khi người dùng đóng Alert.
  if (!invoice || !details)
    return (
      <SafeAreaView style={common.screen}>
        <EmptyState
          title="Không thể mở hóa đơn"
          description="Hóa đơn hoặc dữ liệu món không còn hợp lệ."
          actionTitle="Về sơ đồ bàn"
          onAction={goToTables}
        />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={common.screen} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={common.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          style={styles.receipt}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={common.content}
        >
          <View style={styles.receiptHead}>
            <Text style={styles.eyebrow}>HÓA ĐƠN THANH TOÁN</Text>
            <Text style={styles.table}>
              Bàn {String(invoice.tableNumber).padStart(2, '0')}
            </Text>
            <Text style={common.muted}>{invoice.createdAt}</Text>
          </View>
          {details.lines.length === 0 && (
            <EmptyState
              title="Chưa có món"
              description="Chọn món trước khi thanh toán."
            />
          )}
          {details.lines.map(line => (
            <View style={[common.card, styles.line]} key={line.dishId}>
              <Text style={common.label}>{line.name}</Text>
              <View style={common.row}>
                <Text style={common.muted}>
                  {line.quantity} × {formatMoney(line.unitPrice)}
                </Text>
                <Text style={styles.lineTotal}>
                  {formatMoney(line.lineTotal)}
                </Text>
              </View>
            </View>
          ))}
          <View style={[common.card, styles.summary]}>
            <View style={common.row}>
              <Text style={common.muted}>Tạm tính</Text>
              <Text style={common.text}>{formatMoney(details.subtotal)}</Text>
            </View>
            <View style={common.row}>
              <Text style={common.muted}>VAT (8%)</Text>
              <Text style={common.text}>{formatMoney(details.vat)}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={common.label}>Tổng cộng</Text>
            <Text style={styles.total}>{formatMoney(details.total)}</Text>
          </View>
        </ScrollView>
        {/* Cụm nhập tiền và nút nằm ngoài vùng cuộn: bàn phím đẩy cả cụm lên. */}
        <View style={styles.paymentFooter}>
          <View style={styles.field}>
            <Text style={common.label}>Tiền khách đưa (VNĐ)</Text>
            <TextInput
              accessibilityLabel="Tiền khách đưa"
              value={receivedText}
              onChangeText={setReceivedText}
              editable={!paymentInProgress && invoice.status === 'Đang phục vụ'}
              keyboardType="number-pad"
              placeholder="Nhập số tiền khách đưa"
              placeholderTextColor={colors.muted}
              style={[
                common.input,
                receivedText.length > 0 && !canPay && common.inputError,
              ]}
            />
            {receivedText.length > 0 && received === null ? (
              <Text style={common.error}>
                Vui lòng nhập số tiền hợp lệ bằng chữ số.
              </Text>
            ) : (
              <View
                style={[
                  styles.change,
                  received !== null &&
                    received >= details.total &&
                    styles.enough,
                ]}
              >
                <Text style={common.label}>
                  {received !== null && received >= details.total
                    ? 'Tiền thừa'
                    : 'Còn thiếu'}
                </Text>
                <Text style={styles.changeValue}>
                  {formatMoney(Math.abs((received ?? 0) - details.total))}
                </Text>
              </View>
            )}
          </View>
          <AppButton
            title={
              paymentInProgress
                ? 'Đang thanh toán…'
                : invoice.status === 'Đã thanh toán'
                ? 'Đã thanh toán'
                : 'Xác nhận thanh toán'
            }
            disabled={!canPay || paymentInProgress}
            onPress={pay}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  receiptHead: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: colors.primary,
  },
  table: { fontSize: 30, fontWeight: '800', color: colors.text },
  line: { gap: 10 },
  lineTotal: { fontSize: 16, fontWeight: '700', color: colors.text },
  summary: { gap: 12 },
  divider: { height: 1, backgroundColor: colors.border },
  total: { fontSize: 32, fontWeight: '800', color: colors.primary },
  receipt: { flex: 1 },
  paymentFooter: {
    backgroundColor: colors.surface,
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  field: { gap: 10 },
  change: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  enough: { backgroundColor: colors.successSoft },
  changeValue: { fontSize: 20, fontWeight: '700', color: colors.text },
});
