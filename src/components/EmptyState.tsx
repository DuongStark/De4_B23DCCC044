import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, common } from '../theme/colors';
import AppButton from './AppButton';

type Props = {
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
};
export default function EmptyState({
  title,
  description,
  actionTitle,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mark}>
        <Text style={styles.markText}>—</Text>
      </View>
      <Text style={common.title}>{title}</Text>
      <Text style={[common.muted, styles.description]}>{description}</Text>
      {actionTitle && onAction ? (
        <AppButton title={actionTitle} onPress={onAction} />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24, gap: 12 },
  mark: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { color: colors.primary, fontSize: 28 },
  description: { textAlign: 'center' },
});
