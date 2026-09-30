import React, { useMemo } from 'react';
import BookOpen from 'lucide-react-native/icons/book-open';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import House from 'lucide-react-native/icons/house';
import UserRound from 'lucide-react-native/icons/user-round';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemeColors } from '../theme';

const tabs = [
  { label: 'Trang chủ', icon: House, active: true },
  { label: 'Môn học', icon: BookOpen, active: false },
  { label: 'Bài tập', icon: ClipboardList, active: false },
  { label: 'Cá nhân', icon: UserRound, active: false },
];

export default function BottomNavigation({ colors }: { colors: ThemeColors }) {
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map(({ label, icon: Icon, active }) => (
        <Pressable
          key={label}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          style={styles.tab}
        >
          <View style={[styles.iconArea, active && styles.activeIconArea]}>
            <Icon
              size={21}
              color={active ? colors.green : colors.iconMuted}
              strokeWidth={active ? 2.2 : 1.8}
            />
          </View>
          <Text style={[styles.label, active && styles.activeLabel]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 10,
      paddingHorizontal: 12,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
    },
    iconArea: {
      width: 52,
      height: 31,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
    },
    activeIconArea: {
      backgroundColor: colors.greenSoft,
    },
    label: {
      marginTop: 4,
      color: colors.iconMuted,
      fontSize: 10.5,
      lineHeight: 15,
      fontWeight: '500',
    },
    activeLabel: {
      color: colors.green,
      fontWeight: '700',
    },
  });
}
