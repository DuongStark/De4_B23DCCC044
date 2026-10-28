import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { Dish } from '../types';
import { colors, common } from '../theme/colors';
import { formatMoney } from '../utils/format';

type Props = { dish: Dish } & (
  | {
      mode: 'menu';
      onEdit: () => void;
      onDelete: () => void;
      onToggle: () => void;
    }
  | {
      mode: 'order';
      quantity: number;
      onIncrease: () => void;
      onDecrease: () => void;
    }
);
export default function DishCard(props: Props) {
  const { dish } = props;
  const content = (
    <View style={[styles.info, !dish.available && styles.unavailable]}>
      <Text style={styles.name}>{dish.name}</Text>
      <Text style={styles.price}>{formatMoney(dish.price)}</Text>
      {!dish.available && <Text style={styles.badge}>Hết món</Text>}
    </View>
  );
  return (
    <View style={[common.card, styles.card]}>
      {props.mode === 'menu' ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Sửa ${dish.name}, nhấn giữ để xóa`}
            onPress={props.onEdit}
            onLongPress={props.onDelete}
            style={({ pressed }) => [styles.info, pressed && common.pressed]}
          >
            {content}
          </Pressable>
          <Switch
            accessibilityLabel={`Còn phục vụ ${dish.name}`}
            value={dish.available}
            onValueChange={props.onToggle}
            trackColor={{ false: colors.border, true: colors.primaryTrack }}
            thumbColor={dish.available ? colors.primary : colors.muted}
          />
        </>
      ) : (
        <>
          {content}
          <View style={styles.stepper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Giảm ${dish.name}`}
              disabled={props.quantity === 0}
              onPress={props.onDecrease}
              style={({ pressed }) => [
                styles.step,
                props.quantity === 0 && styles.disabled,
                pressed && common.pressed,
              ]}
            >
              <Text style={styles.stepText}>−</Text>
            </Pressable>
            <Text
              accessibilityLabel={`Số lượng ${dish.name}`}
              style={styles.quantity}
            >
              {props.quantity}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Thêm ${dish.name}`}
              disabled={!dish.available}
              onPress={props.onIncrease}
              style={({ pressed }) => [
                styles.step,
                !dish.available && styles.disabled,
                pressed && common.pressed,
              ]}
            >
              <Text style={styles.stepText}>+</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  info: { flex: 1, gap: 6 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  price: { fontSize: 15, fontWeight: '700', color: colors.price },
  badge: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  unavailable: { opacity: 0.5 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  step: {
    height: 44,
    width: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 24, color: colors.primary, fontWeight: '600' },
  quantity: {
    minWidth: 25,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  disabled: { backgroundColor: colors.disabled, opacity: 0.45 },
});
