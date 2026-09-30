# Giao diện quản lý sinh viên

Ứng dụng React Native gồm một màn hình Trang chủ: lời chào và ảnh đại diện, ba thẻ thống kê, ô tìm kiếm môn học, bốn môn học có thanh tiến độ, thanh điều hướng bốn mục và nút bật/tắt Dark Mode. Màn hình dùng View, Text, Image, TextInput, ScrollView, Pressable, StyleSheet và Flexbox. Thanh điều hướng chỉ là giao diện theo yêu cầu bài tập.

Giao diện ban đầu theo chế độ sáng/tối của hệ thống; nút bên cạnh tiêu đề “Tổng quan” cho phép đổi thủ công.

Yêu cầu Node.js 22.13+ (nhánh 22), 24.3+ (nhánh 24) hoặc 26+.

## Chạy dự án

~~~bash
npm install
npm start
~~~

Mở terminal khác và chạy npm run android hoặc npm run ios (cần môi trường build tương ứng).

## Kiểm tra

~~~bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
~~~

Icon nét mảnh dùng [Lucide](https://lucide.dev/). Ảnh đại diện lưu cục bộ từ [Unsplash](https://images.unsplash.com/photo-1544005313-94ddf0286df2).
