# Kiểm tra Mây — 14/10/2026

- Jest: 11/11 test tương tác qua, dùng navigation thật. Bao phủ từ chối ô trống/khoảng trắng, đăng nhập, tìm kiếm không dấu, kết quả trống, gửi tin và cập nhật Home, cùng lịch sử từ Danh bạ, đọc một/tất cả thông báo, hai Switch, bộ lọc chưa đọc, chat mới và xóa dữ liệu khi đăng xuất.
- `npx tsc --noEmit`: không lỗi.
- `npm run lint`: không lỗi hoặc cảnh báo.
- Prettier và `git diff --check`: qua.
- Metro bundle Android ở chế độ production: tạo bundle thành công và đóng gói tài nguyên. Bundle được kiểm tra nằm ở `/tmp/may-android/index.android.bundle`.
- Android: `./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a --max-workers=2`, BUILD SUCCESSFUL. APK debug nằm tại `android/app/build/outputs/apk/debug/app-debug.apk`; cần Metro khi chạy.
- XML manifest, icon vector và iOS storyboard: parse hợp lệ.
- Bản render kiểm tra bằng React Native Web trong thư mục tạm: đã xem sáu màn ở 390×844 và chạy đăng nhập, mở chat, gửi tin, đổi tab, đăng xuất. Không thêm web dependency vào dự án. Các ảnh `/tmp/may-{login,home,chat,contacts,notifications,settings}.png` là bản render kiểm tra, không phải ảnh emulator.
- Không còn source/test/tài liệu chức năng của các app cũ trong dự án hiện tại; bỏ qua các worktree do công cụ khác quản lý trong `.kilo`.

Chưa chạy trên thiết bị Android/iOS thực hoặc iOS simulator: môi trường hiện tại không có thiết bị/emulator kết nối và không có Xcode. Kiểm tra render web không chứng minh hành vi bàn phím, font và gesture giống hoàn toàn thiết bị native.

Các cảnh báo dependency được ghi trong `dependency-audit.md`. Review độc lập đã kiểm tra luồng ứng dụng và native setup; sửa chiều cao tab theo safe area, tài liệu cũ và màn khởi động iOS theo các phát hiện.
