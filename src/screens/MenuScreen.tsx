import React from 'react';
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CATEGORIES } from '../types';
import type {
  ActionResult,
  RestaurantData,
  RootStackParamList,
} from '../types';
import { colors, common } from '../theme/colors';
import { countOccupiedTables } from '../utils/invoices';
import AppButton from '../components/AppButton';
import DishCard from '../components/DishCard';
import EmptyState from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'> &
  RestaurantData & {
    onToggle: (id: string) => ActionResult;
    onDelete: (id: string) => ActionResult;
  };
export default function MenuScreen({
  navigation,
  dishes,
  invoices,
  onToggle,
  onDelete,
}: Props) {
  const sections = CATEGORIES.map(category => ({
    title: category,
    data: dishes.filter(d => d.category === category),
  })).filter(section => section.data.length > 0);
  function showResult(result: ActionResult) {
    if (!result.ok) Alert.alert('Chưa thể thực hiện', result.error);
  }
  function confirmDelete(id: string, name: string) {
    Alert.alert('Xóa món ăn?', `Bạn muốn xóa “${name}” khỏi thực đơn?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa món',
        style: 'destructive',
        onPress: () => showResult(onDelete(id)),
      },
    ]);
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
            <Text style={styles.eyebrow}>QUẢN LÝ NHÀ HÀNG</Text>
            <Text style={styles.heading}>Hôm nay phục vụ gì?</Text>
            <Text style={common.muted}>
              {dishes.length} món · {countOccupiedTables(invoices)}/10 bàn có
              khách
            </Text>
            <View style={styles.actions}>
              <View style={styles.flex}>
                <AppButton
                  title="Sơ đồ bàn"
                  variant="secondary"
                  onPress={() => navigation.navigate('Tables')}
                />
              </View>
              <View style={styles.flex}>
                <AppButton
                  title="+ Thêm món"
                  onPress={() => navigation.navigate('DishForm', {})}
                />
              </View>
            </View>
            <Text style={styles.hint}>Chạm món để sửa · Nhấn giữ để xóa</Text>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>
            {section.title}
            <Text style={common.muted}> · {section.data.length}</Text>
          </Text>
        )}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            mode="menu"
            onEdit={() => navigation.navigate('DishForm', { dishId: item.id })}
            onDelete={() => confirmDelete(item.id, item.name)}
            onToggle={() => showResult(onToggle(item.id))}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Thực đơn còn trống"
            description="Thêm món đầu tiên để bắt đầu phục vụ."
            actionTitle="+ Thêm món"
            onAction={() => navigation.navigate('DishForm', {})}
          />
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 24 },
  header: { gap: 10, marginBottom: 12 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.8,
    fontWeight: '700',
    color: colors.primary,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 36,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  flex: { flex: 1 },
  hint: { fontSize: 12, color: colors.muted },
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingTop: 10,
    paddingBottom: 12,
  },
});
