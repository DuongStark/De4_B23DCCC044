import React, { useMemo } from 'react';
import CodeXml from 'lucide-react-native/icons/code-xml';
import Database from 'lucide-react-native/icons/database';
import Languages from 'lucide-react-native/icons/languages';
import PenTool from 'lucide-react-native/icons/pen-tool';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Course, CourseIcon } from '../data/courses';
import type { ThemeColors } from '../theme';

const courseIcons = {
  code: CodeXml,
  database: Database,
  design: PenTool,
  language: Languages,
} satisfies Record<CourseIcon, typeof CodeXml>;

type Props = {
  course: Course;
  colors: ThemeColors;
  darkMode: boolean;
};

export default function CourseCard({ course, colors, darkMode }: Props) {
  const Icon = courseIcons[course.icon];
  const completed = course.progress === 100;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.lessons} bài học, hoàn thành ${course.progress}%`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.courseIcon,
            {
              backgroundColor: darkMode
                ? colors.greenSoft
                : course.iconBackground,
            },
          ]}
        >
          <Icon
            size={23}
            color={darkMode ? colors.green : course.iconColor}
            strokeWidth={1.8}
          />
        </View>
        <View style={styles.courseText}>
          <Text style={styles.title} numberOfLines={1}>
            {course.title}
          </Text>
          <Text style={styles.lessonCount}>{course.lessons} bài học</Text>
        </View>
      </View>

      <View style={styles.progressHeader}>
        <Text
          style={[styles.progressLabel, completed && styles.completedLabel]}
        >
          {completed ? 'Đã hoàn thành' : 'Tiến độ học tập'}
        </Text>
        <Text style={styles.progressValue}>{course.progress}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${course.progress}%` }]} />
      </View>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
    },
    cardPressed: {
      opacity: 0.8,
      transform: [{ scale: 0.99 }],
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    courseIcon: {
      width: 50,
      height: 50,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    courseText: {
      flex: 1,
      marginLeft: 13,
    },
    title: {
      color: colors.ink,
      fontSize: 15.5,
      lineHeight: 22,
      fontWeight: '600',
    },
    lessonCount: {
      marginTop: 2,
      color: colors.muted,
      fontSize: 12.5,
      lineHeight: 18,
    },
    progressHeader: {
      marginTop: 18,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressLabel: {
      color: colors.muted,
      fontSize: 11.5,
      fontWeight: '500',
    },
    completedLabel: {
      color: colors.green,
      fontWeight: '600',
    },
    progressValue: {
      color: colors.green,
      fontSize: 12,
      fontWeight: '700',
    },
    track: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: colors.track,
    },
    fill: {
      height: '100%',
      borderRadius: 3,
      backgroundColor: colors.green,
    },
  });
}
