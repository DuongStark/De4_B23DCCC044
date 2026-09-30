import React, { useMemo, useState } from 'react';
import Bell from 'lucide-react-native/icons/bell';
import BookOpen from 'lucide-react-native/icons/book-open';
import CheckCheck from 'lucide-react-native/icons/check-check';
import ClipboardList from 'lucide-react-native/icons/clipboard-list';
import Moon from 'lucide-react-native/icons/moon';
import Search from 'lucide-react-native/icons/search';
import Sun from 'lucide-react-native/icons/sun';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from './src/components/BottomNavigation';
import CourseCard from './src/components/CourseCard';
import StatCard from './src/components/StatCard';
import { courses } from './src/data/courses';
import { darkColors, lightColors } from './src/theme';
import type { ThemeColors } from './src/theme';

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function HomeScreen() {
  const [search, setSearch] = useState('');
  const systemDarkMode = useColorScheme() === 'dark';
  const [themeOverride, setThemeOverride] = useState<boolean | null>(null);
  const darkMode = themeOverride ?? systemDarkMode;
  const colors = darkMode ? darkColors : lightColors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const filteredCourses = useMemo(() => {
    const query = normalizeSearch(search.trim());
    return query
      ? courses.filter(course => normalizeSearch(course.title).includes(query))
      : courses;
  }, [search]);

  const completedCount = courses.filter(
    course => course.progress === 100,
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>CHÀO MỪNG TRỞ LẠI</Text>
              <Text style={styles.studentName}>Nguyễn Minh Anh</Text>
              <Text style={styles.headerSubtitle}>
                Hôm nay bạn muốn học gì?
              </Text>
            </View>
            <View style={styles.headerActions}>
              <View style={styles.bellWrap} accessibilityLabel="Thông báo">
                <Bell size={21} color={colors.ink} strokeWidth={1.8} />
                <View style={styles.notificationDot} />
              </View>
              <Image
                source={require('./src/assets/student-avatar.jpg')}
                style={styles.avatar}
                accessibilityLabel="Ảnh đại diện sinh viên"
              />
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Tổng quan</Text>
            <Pressable
              testID="theme-toggle"
              onPress={() => setThemeOverride(!darkMode)}
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
              accessibilityLabel={
                darkMode ? 'Bật chế độ sáng' : 'Bật chế độ tối'
              }
              style={({ pressed }) => [
                styles.themeToggle,
                pressed && styles.themeTogglePressed,
              ]}
            >
              {darkMode ? (
                <Sun size={16} color={colors.green} strokeWidth={1.9} />
              ) : (
                <Moon size={16} color={colors.green} strokeWidth={1.9} />
              )}
              <Text style={styles.themeToggleText}>
                {darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
              </Text>
            </Pressable>
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={BookOpen}
              value={courses.length}
              label="Môn học"
              colors={colors}
            />
            <StatCard
              icon={ClipboardList}
              value={7}
              label="Bài tập"
              colors={colors}
            />
            <StatCard
              icon={CheckCheck}
              value={completedCount}
              label="Đã hoàn thành"
              colors={colors}
            />
          </View>

          <View style={styles.searchBox}>
            <Search size={20} color={colors.muted} strokeWidth={1.9} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm kiếm môn học..."
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.green}
              accessibilityLabel="Tìm kiếm môn học"
              returnKeyType="search"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.courseHeading}>
            <View>
              <Text style={styles.sectionTitle}>Môn học của bạn</Text>
              <Text style={styles.courseSubtitle}>
                Tiếp tục hành trình học tập
              </Text>
            </View>
            <View style={styles.courseCountWrap}>
              <Text style={styles.courseCount}>
                {filteredCourses.length} môn
              </Text>
            </View>
          </View>

          <View style={styles.courseList}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  colors={colors}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Không tìm thấy môn học</Text>
                <Text style={styles.emptySubtitle}>
                  Thử tìm bằng tên môn học khác.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        <BottomNavigation colors={colors} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screen: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerText: {
      flex: 1,
      paddingTop: 4,
    },
    greeting: {
      color: colors.green,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.35,
    },
    studentName: {
      marginTop: 7,
      color: colors.ink,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      marginTop: 5,
      color: colors.muted,
      fontSize: 13,
      lineHeight: 18,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 8,
      gap: 10,
    },
    bellWrap: {
      width: 39,
      height: 39,
      borderRadius: 13,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.notification,
      borderWidth: 1,
      borderColor: colors.surface,
    },
    avatar: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: colors.greenSoft,
    },
    sectionHeading: {
      marginTop: 31,
      marginBottom: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: colors.ink,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '700',
      letterSpacing: -0.35,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    themeTogglePressed: {
      opacity: 0.7,
    },
    themeToggleText: {
      color: colors.green,
      fontSize: 11,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      gap: 9,
    },
    searchBox: {
      marginTop: 26,
      height: 54,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      height: '100%',
      marginLeft: 11,
      paddingVertical: 0,
      color: colors.ink,
      fontSize: 14,
    },
    courseHeading: {
      marginTop: 29,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    courseSubtitle: {
      marginTop: 3,
      color: colors.muted,
      fontSize: 12,
      lineHeight: 17,
    },
    courseCountWrap: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 9,
      backgroundColor: colors.greenSoft,
    },
    courseCount: {
      color: colors.green,
      fontSize: 11,
      fontWeight: '700',
    },
    courseList: {
      paddingBottom: 2,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 36,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      color: colors.ink,
      fontSize: 15,
      fontWeight: '600',
    },
    emptySubtitle: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 6,
    },
  });
}
