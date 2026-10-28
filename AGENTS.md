# Hướng dẫn làm việc trong dự án

@/home/duongstark/.codex/RTK.md

## Mục tiêu và cách viết code

Đây là nền React Native cho bài kiểm tra giữa kì môn Lập trình ứng dụng đa nền tảng. Người học được dùng AI hỗ trợ, nhưng cần tự giải thích toàn bộ code, luồng xử lý và tự sửa chức năng khi được yêu cầu.

- Ưu tiên code đơn giản, rõ ràng, phù hợp người mới học React Native.
- Dùng tên biến và hàm diễn tả đúng mục đích; viết hàm ngắn và luồng xử lý trực tiếp.
- Ưu tiên state cục bộ và truyền props khi đủ dùng. Chỉ thêm thư viện, context hoặc cách tổ chức phức tạp khi có nhu cầu thực tế.
- Tách màn hình và component khi giúp dễ đọc; tránh chia quá nhiều file nhỏ hoặc tạo lớp trung gian không cần thiết.
- Comment bằng tiếng Việt ở các chỗ cần lưu ý: mục đích của state, xử lý sự kiện, chuyển màn hình, kiểm tra dữ liệu, lưu dữ liệu và những đoạn khó hiểu. Không comment lặp lại từng dòng code hiển nhiên.
- Giao diện vẫn cần đẹp, nhất quán, dễ thao tác; chú ý khoảng cách, chữ dễ đọc, bàn phím, vùng an toàn và phản hồi khi bấm nút.
- Khi bàn giao chức năng, giải thích ngắn gọn: file chính, dữ liệu được lưu ở đâu, thao tác người dùng gọi hàm nào và hàm đó cập nhật giao diện ra sao.
- Chỉ rõ chỗ sửa chữ, màu, nút và logic chức năng để người học có thể tự chỉnh khi được hỏi.
- Bám sát đề bài được cung cấp; chưa có đề thì giữ nền tối giản, không tự thêm chức năng.

## Tài liệu giải thích riêng

- Viết phần phân tích đề, giải thích code, luồng xử lý và hướng dẫn tự chỉnh sửa vào các file Markdown riêng trong `docs-local/`.
- Thư mục `docs-local/` phải nằm trong `.gitignore`; không stage hoặc commit các tài liệu cá nhân này.
- Khi bắt đầu có code chức năng, cập nhật `docs-local/GIAI_THICH_CODE.md` theo từng màn hình: state, props, hàm xử lý nút, luồng dữ liệu và vị trí chỉnh sửa.
- Vẫn giữ comment tiếng Việt cần thiết ngay trong code; tài liệu riêng dành cho phần giải thích chi tiết.
