/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text, TextInput } from 'react-native';
import App from '../App';

jest.mock('react-native-safe-area-context', () => {
  const ReactModule = require('react');
  const { View } = require('react-native');
  const SafeArea = ({ children }: { children: React.ReactNode }) =>
    ReactModule.createElement(View, null, children);
  return {
    SafeAreaProvider: SafeArea,
    SafeAreaView: SafeArea,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

test('hiển thị đủ nội dung trang chủ', async () => {
  let screen!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    screen = ReactTestRenderer.create(<App />);
  });

  const content = JSON.stringify(screen.toJSON());
  expect(content).toContain('Nguyễn Minh Anh');
  expect(content).toContain('Đã hoàn thành');
  expect(content).toContain('Lập trình React Native');
  expect(content).toContain('Cơ sở dữ liệu');
  expect(content).toContain('Thiết kế giao diện');
  expect(content).toContain('Tiếng Anh chuyên ngành');
  expect(content).toContain('Trang chủ');
  expect(content).toContain('Cá nhân');
});

test('tìm kiếm môn học không cần gõ dấu', async () => {
  let screen!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    screen = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(async () => {
    screen.root.findByType(TextInput).props.onChangeText('co so du lieu');
  });

  const content = JSON.stringify(screen.toJSON());
  expect(content).toContain('Cơ sở dữ liệu');
  expect(content).not.toContain('Lập trình React Native');
  const labels = screen.root
    .findAllByType(Text)
    .map(node => [node.props.children].flat().join(''));
  expect(labels).toContain('1 môn');
});

test('đổi sang Dark Mode và trở lại giao diện sáng', async () => {
  let screen!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    screen = ReactTestRenderer.create(<App />);
  });

  const toggle = () => screen.root.findByProps({ testID: 'theme-toggle' });
  expect(toggle().props.accessibilityState.checked).toBe(false);

  await ReactTestRenderer.act(async () => {
    toggle().props.onPress();
  });

  expect(toggle().props.accessibilityState.checked).toBe(true);
  expect(JSON.stringify(screen.toJSON())).toContain('#1C2821');

  await ReactTestRenderer.act(async () => {
    toggle().props.onPress();
  });

  expect(toggle().props.accessibilityState.checked).toBe(false);
  expect(JSON.stringify(screen.toJSON())).toContain('#FFFFFF');
});
