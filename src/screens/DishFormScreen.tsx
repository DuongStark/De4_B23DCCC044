import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CATEGORIES } from '../types';
import type {
  ActionResult,
  Category,
  Dish,
  DishInput,
  RootStackParamList,
} from '../types';
import { colors, common } from '../theme/colors';
import { validateDish } from '../utils/validation';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'DishForm'> & {
  dishes: Dish[];
  onSave: (input: DishInput, id?: string) => ActionResult;
};
export default function DishFormScreen({
  navigation,
  route,
  dishes,
  onSave,
}: Props) {
  const id = route.params.dishId;
  const dish = dishes.find(d => d.id === id);
  // Ô nhập là state riêng của form, không ghi đè món thật trước khi nhấn Lưu.
  const [name, setName] = useState(dish?.name ?? '');
  const [price, setPrice] = useState(dish ? String(dish.price) : '');
  const [category, setCategory] = useState<Category>(
    dish?.category ?? 'Khai vị',
  );
  const [submitted, setSubmitted] = useState(false);
  const headerHeight = useHeaderHeight();
  const input = { name, price, category };
  const errors = submitted ? validateDish(input, dishes, id) : {};
  function save() {
    setSubmitted(true);
    if (Object.keys(validateDish(input, dishes, id)).length) return;
    const result = onSave(input, id);
    if (!result.ok) {
      Alert.alert('Chưa lưu được món', result.error);
      return;
    }
    navigation.goBack();
  }
  if (id && !dish)
    return (
      <EmptyState
        title="Không tìm thấy món"
        description="Món này có thể đã được xóa."
        actionTitle="Về thực đơn"
        onAction={() => navigation.goBack()}
      />
    );
  return (
    <SafeAreaView style={common.screen} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={common.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={common.content}
        >
          <View style={styles.intro}>
            <Text style={common.title}>
              {id ? 'Chỉnh sửa món ăn' : 'Thêm một món mới'}
            </Text>
            <Text style={common.muted}>
              Thông tin rõ ràng giúp gọi món chính xác hơn.
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={common.label}>Tên món</Text>
            <TextInput
              accessibilityLabel="Tên món"
              value={name}
              onChangeText={setName}
              placeholder="Ví dụ: Cơm gà sốt nấm"
              placeholderTextColor={colors.muted}
              style={[common.input, errors.name && common.inputError]}
              returnKeyType="next"
            />
            {errors.name && <Text style={common.error}>{errors.name}</Text>}
          </View>
          <View style={styles.field}>
            <Text style={common.label}>Giá bán (VNĐ)</Text>
            <TextInput
              accessibilityLabel="Giá bán"
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              placeholder="Ví dụ: 45000"
              placeholderTextColor={colors.muted}
              style={[common.input, errors.price && common.inputError]}
            />
            <Text style={common.muted}>
              Giá lớn hơn 0 và là bội của 1.000 đ.
            </Text>
            {errors.price && <Text style={common.error}>{errors.price}</Text>}
          </View>
          <View style={styles.field}>
            <Text style={common.label}>Loại món</Text>
            <View style={styles.categories}>
              {CATEGORIES.map(item => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: category === item }}
                  onPress={() => setCategory(item)}
                  style={({ pressed }) => [
                    styles.category,
                    category === item && styles.selected,
                    pressed && common.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <AppButton title={id ? 'Lưu thay đổi' : 'Thêm món'} onPress={save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  intro: { gap: 8, marginBottom: 8 },
  field: { gap: 8, marginBottom: 4 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minWidth: '44%',
    alignItems: 'center',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  categoryText: { fontSize: 16, color: colors.muted },
  selectedText: { fontWeight: '700', color: colors.primary },
});
