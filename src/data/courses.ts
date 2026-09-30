export type CourseIcon = 'code' | 'database' | 'design' | 'language';

export type Course = {
  id: string;
  title: string;
  lessons: number;
  progress: number;
  icon: CourseIcon;
  iconColor: string;
  iconBackground: string;
};

export const courses: Course[] = [
  {
    id: 'react-native',
    title: 'Lập trình React Native',
    lessons: 12,
    progress: 75,
    icon: 'code',
    iconColor: '#386A5A',
    iconBackground: '#EAF2EC',
  },
  {
    id: 'database',
    title: 'Cơ sở dữ liệu',
    lessons: 10,
    progress: 60,
    icon: 'database',
    iconColor: '#6A668D',
    iconBackground: '#F0EFF8',
  },
  {
    id: 'design',
    title: 'Thiết kế giao diện',
    lessons: 8,
    progress: 100,
    icon: 'design',
    iconColor: '#A56F49',
    iconBackground: '#F8F0E8',
  },
  {
    id: 'english',
    title: 'Tiếng Anh chuyên ngành',
    lessons: 14,
    progress: 35,
    icon: 'language',
    iconColor: '#4B7086',
    iconBackground: '#EAF2F7',
  },
];
