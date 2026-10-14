import React from 'react';
import {
  fireEvent,
  cleanup,
  within,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import App from '../App';

beforeEach(() => jest.useFakeTimers());

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
});

function login() {
  fireEvent.changeText(screen.getByLabelText('Tài khoản'), 'minhan');
  fireEvent.changeText(screen.getByLabelText('Mật khẩu'), 'demo123');
  fireEvent.press(screen.getByRole('button', { name: 'Đăng nhập' }));
}

test('rejects blank and whitespace-only login fields', () => {
  render(<App />);
  fireEvent.changeText(screen.getByLabelText('Tài khoản'), '   ');
  fireEvent.changeText(screen.getByLabelText('Mật khẩu'), '   ');
  fireEvent.press(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(screen.getByText('Vui lòng nhập tài khoản.')).toBeOnTheScreen();
  expect(screen.getByText('Vui lòng nhập mật khẩu.')).toBeOnTheScreen();
  expect(screen.queryByLabelText('Tìm cuộc trò chuyện')).toBeNull();
});

test('requires both credentials before opening Home', async () => {
  render(<App />);
  fireEvent.changeText(screen.getByLabelText('Tài khoản'), 'minhan');
  fireEvent.press(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(screen.getByText('Vui lòng nhập mật khẩu.')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByLabelText('Mật khẩu'), 'demo123');
  fireEvent.press(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(await screen.findByLabelText('Tìm cuộc trò chuyện')).toBeOnTheScreen();
});

test('searches conversations without accents and shows empty results', async () => {
  render(<App />);
  login();
  const search = await screen.findByLabelText('Tìm cuộc trò chuyện');
  fireEvent.changeText(search, '  bao ngoc  ');
  expect(
    screen.getByRole('button', { name: /Trò chuyện với Bảo Ngọc/ }),
  ).toBeOnTheScreen();
  expect(
    screen.queryByRole('button', { name: /Trò chuyện với Hoàng Nam/ }),
  ).toBeNull();
  fireEvent.changeText(search, 'không có người này');
  expect(screen.getByText('Không tìm thấy cuộc trò chuyện')).toBeOnTheScreen();
  fireEvent.press(screen.getByRole('button', { name: 'Xóa tìm kiếm' }));
  expect(
    screen.getByRole('button', { name: /Trò chuyện với Hoàng Nam/ }),
  ).toBeOnTheScreen();
});

test('opening a conversation clears unread count and sending updates Home', async () => {
  render(<App />);
  login();
  fireEvent.press(
    await screen.findByRole('button', {
      name: 'Trò chuyện với Bảo Ngọc, 2 tin chưa đọc',
    }),
  );
  const composer = await screen.findByLabelText('Tin nhắn');
  fireEvent.changeText(composer, '   ');
  expect(screen.getByRole('button', { name: 'Gửi tin nhắn' })).toBeDisabled();
  fireEvent.changeText(composer, '  Hẹn gặp lúc 6 giờ nhé  ');
  fireEvent.press(screen.getByRole('button', { name: 'Gửi tin nhắn' }));
  expect(screen.getByText('Hẹn gặp lúc 6 giờ nhé')).toBeOnTheScreen();
  expect(screen.getByLabelText('Tin nhắn')).toHaveProp('value', '');
  fireEvent.press(screen.getByRole('button', { name: 'Quay lại' }));
  expect(
    await screen.findByText('Bạn: Hẹn gặp lúc 6 giờ nhé'),
  ).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'Trò chuyện với Bảo Ngọc' }),
  ).toBeOnTheScreen();
});

test('contact search opens the same conversation history', async () => {
  render(<App />);
  login();
  fireEvent.press(await screen.findByLabelText('Danh bạ, tab'));
  const search = await screen.findByLabelText('Tìm trong danh bạ');
  fireEvent.changeText(search, 'DUC');
  expect(
    screen.getByRole('button', { name: /Nhắn tin với Minh Đức/ }),
  ).toBeOnTheScreen();
  expect(
    screen.queryByRole('button', { name: /Nhắn tin với Bảo Ngọc/ }),
  ).toBeNull();
  fireEvent.press(
    screen.getByRole('button', { name: /Nhắn tin với Minh Đức/ }),
  );
  fireEvent.changeText(
    await screen.findByLabelText('Tin nhắn'),
    'Tin từ danh bạ',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Gửi tin nhắn' }));
  fireEvent.press(screen.getByRole('button', { name: 'Quay lại' }));
  fireEvent.press(await screen.findByLabelText('Tin nhắn, tab'));
  expect(await screen.findByText('Bạn: Tin từ danh bạ')).toBeOnTheScreen();
});

test('marks one notification then all notifications as read', async () => {
  render(<App />);
  login();
  fireEvent.press(await screen.findByLabelText('Thông báo, tab'));
  fireEvent.press(
    await screen.findByRole('button', {
      name: 'Đánh dấu đã đọc: Bảo Ngọc đã gửi cho bạn 2 tin nhắn.',
    }),
  );
  expect(
    screen.queryByRole('button', {
      name: 'Đánh dấu đã đọc: Bảo Ngọc đã gửi cho bạn 2 tin nhắn.',
    }),
  ).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Đọc tất cả' }));
  await waitFor(() =>
    expect(
      screen.queryAllByRole('button', { name: /^Đánh dấu đã đọc:/ }),
    ).toHaveLength(0),
  );
  expect(screen.getByText('Bạn đã đọc tất cả thông báo')).toBeOnTheScreen();
});

test('settings toggles activity and logout returns to a cleared login form', async () => {
  render(<App />);
  login();
  fireEvent.press(await screen.findByLabelText('Cài đặt, tab'));
  expect(await screen.findByText('@minhan')).toBeOnTheScreen();
  fireEvent(
    screen.getByRole('switch', { name: 'Hiển thị trạng thái hoạt động' }),
    'valueChange',
    false,
  );
  expect(screen.getByText('Đang ẩn trạng thái')).toBeOnTheScreen();
  fireEvent.press(screen.getByRole('button', { name: 'Đăng xuất' }));
  expect(await screen.findByLabelText('Tài khoản')).toHaveProp('value', '');
  expect(screen.getByLabelText('Mật khẩu')).toHaveProp('value', '');
  expect(screen.queryByLabelText('Tìm cuộc trò chuyện')).toBeNull();
});

test('unread filter removes a conversation after it is opened', async () => {
  render(<App />);
  login();
  fireEvent.press(
    await screen.findByRole('button', {
      name: 'Chỉ hiện cuộc trò chuyện chưa đọc',
    }),
  );
  expect(
    screen.queryByRole('button', { name: 'Trò chuyện với Quỳnh Anh' }),
  ).toBeNull();
  fireEvent.press(
    screen.getByRole('button', {
      name: 'Trò chuyện với Bảo Ngọc, 2 tin chưa đọc',
    }),
  );
  fireEvent.press(await screen.findByRole('button', { name: 'Quay lại' }));
  expect(await screen.findByText('4 tin nhắn chưa đọc')).toBeOnTheScreen();
  expect(
    screen.queryByRole('button', { name: /Trò chuyện với Bảo Ngọc/ }),
  ).toBeNull();
});

test('a contact without history starts empty and appears on Home after sending', async () => {
  render(<App />);
  login();
  fireEvent.press(await screen.findByLabelText('Danh bạ, tab'));
  fireEvent.changeText(
    await screen.findByLabelText('Tìm trong danh bạ'),
    'gia huy',
  );
  fireEvent.press(screen.getByRole('button', { name: /Nhắn tin với Gia Huy/ }));
  expect(await screen.findByText('Chào Huy một tiếng nhé')).toBeOnTheScreen();
  fireEvent.changeText(screen.getByLabelText('Tin nhắn'), 'Chào Huy!');
  fireEvent.press(screen.getByRole('button', { name: 'Gửi tin nhắn' }));
  fireEvent.press(screen.getByRole('button', { name: 'Quay lại' }));
  fireEvent.press(await screen.findByLabelText('Tin nhắn, tab'));
  expect(await screen.findByText('Bạn: Chào Huy!')).toBeOnTheScreen();
});

test('turning off notification badges hides the count but keeps notifications', async () => {
  render(<App />);
  login();
  const notificationsTab = await screen.findByLabelText('Thông báo, tab');
  expect(within(notificationsTab).getByText('3')).toBeOnTheScreen();
  fireEvent.press(screen.getByLabelText('Cài đặt, tab'));
  fireEvent(
    await screen.findByRole('switch', { name: 'Hiển thị dấu nhắc thông báo' }),
    'valueChange',
    false,
  );
  expect(
    within(screen.getByLabelText('Thông báo, tab')).queryByText('3'),
  ).toBeNull();
  fireEvent.press(screen.getByLabelText('Thông báo, tab'));
  expect(await screen.findByText('3 thông báo chưa đọc')).toBeOnTheScreen();
});

test('logout discards sent messages before a new session', async () => {
  render(<App />);
  login();
  fireEvent.press(
    await screen.findByRole('button', { name: /Trò chuyện với Bảo Ngọc/ }),
  );
  fireEvent.changeText(
    await screen.findByLabelText('Tin nhắn'),
    'Tin riêng của phiên trước',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Gửi tin nhắn' }));
  fireEvent.press(screen.getByRole('button', { name: 'Quay lại' }));
  fireEvent.press(await screen.findByLabelText('Cài đặt, tab'));
  fireEvent.press(await screen.findByRole('button', { name: 'Đăng xuất' }));
  await screen.findByLabelText('Tài khoản');
  login();
  expect(
    await screen.findByRole('button', {
      name: 'Trò chuyện với Bảo Ngọc, 2 tin chưa đọc',
    }),
  ).toBeOnTheScreen();
  expect(screen.queryByText('Bạn: Tin riêng của phiên trước')).toBeNull();
});
