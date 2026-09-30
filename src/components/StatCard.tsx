import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { ThemeColors } from '../theme';

type Props = {
  icon: LucideIcon;
  value: number;
  label: string;
  colors: ThemeColors;
};

export default function StatCard({ icon: Icon, value, label, colors }: Props) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon size={18} color={colors.green} strokeWidth={1.9} />
      </View>
      <Text style={styles.value}>{String(value).padStart(2, '0')}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flex: 1,
      minHeight: 142,
      paddingHorizontal: 13,
      paddingVertical: 14,
      borderRadius: 18,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.greenSoft,
    },
    value: {
      marginTop: 14,
      color: colors.ink,
      fontSize: 25,
      lineHeight: 30,
      fontWeight: '700',
      letterSpacing: -0.8,
    },
    label: {
      marginTop: 3,
      color: colors.muted,
      fontSize: 11.5,
      lineHeight: 16,
      fontWeight: '500',
    },
  });
}
