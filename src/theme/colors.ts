import { StyleSheet } from 'react-native';

// Đổi màu chung của ứng dụng tại đây; chữ tối trên nền sáng để dễ đọc.
export const colors = {
  background: '#FAF5F1',
  surface: '#FFFFFF',
  primary: '#7A2842',
  primarySoft: '#F4E7EC',
  primaryBorder: '#DEC4CD',
  primaryTrack: '#CFA5B4',
  price: '#674438',
  text: '#2F2526',
  muted: '#68595D',
  border: '#E5DAD7',
  danger: '#B91C1C',
  success: '#166534',
  successSoft: '#DCFCE7',
  successBorder: '#86EFAC',
  dangerSoft: '#FEF2F2',
  disabled: '#E9E1E0',
};
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const fontSize = { small: 14, body: 16, heading: 20, total: 28 };
// Các màn dùng chung những style cơ bản để giao diện nhất quán.
export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  title: { fontSize: fontSize.heading, fontWeight: '700', color: colors.text },
  text: { fontSize: fontSize.body, color: colors.text },
  muted: { fontSize: fontSize.small, color: colors.muted, lineHeight: 21 },
  label: { fontSize: fontSize.body, color: colors.text, fontWeight: '600' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: fontSize.body,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { fontSize: fontSize.small, color: colors.danger },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  pressed: { opacity: 0.65 },
});
