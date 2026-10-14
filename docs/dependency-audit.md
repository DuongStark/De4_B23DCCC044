# Dependency audit — 14/10/2026

Đã chạy `npm audit` và cập nhật các bản vá tương thích bằng `npm audit fix --ignore-scripts`. Lỗi critical của `shell-quote` đã được xử lý. Audit còn 49 high và 5 moderate, chủ yếu là các chuỗi phụ thuộc của Metro, Jest và React Native CLI.

Ba nguồn cảnh báo còn lại:

- `braces`: đệ quy không giới hạn khi phân tích glob lồng nhau. Dùng trong công cụ tìm file và test; ứng dụng không nhận glob từ người dùng. Registry chưa đưa ra bản sửa trong dải hiện tại, hướng xử lý tự động đề nghị hạ React Native xuống 0.72.17 nên chưa áp dụng.
- `image-size`: vòng lặp khi đọc ảnh ICNS/JXL/HEIF không hợp lệ. Dùng khi đóng gói tài nguyên; ứng dụng chỉ đóng gói các JPEG mẫu và không có chức năng nhập file. Cần kiểm tra nâng phiên bản theo yêu cầu Metro trong lần bảo trì toolchain.
- `sprintf-js`: precision không giới hạn trong chuỗi format. Dùng bởi các công cụ cấu hình/test qua argparse/js-yaml; ứng dụng không chuyển tin nhắn vào formatter này. Khắc phục tự động yêu cầu nâng major của Jest, ngoài phạm vi bài chat.

Các cảnh báo này được hoãn vì đầu vào tương ứng không đi từ giao diện ứng dụng đến thư viện; không coi audit là sạch. Kiểm tra lại trước khi phát hành hoặc thêm nhập file, server hay dữ liệu cấu hình bên ngoài, chậm nhất 14/11/2026.
