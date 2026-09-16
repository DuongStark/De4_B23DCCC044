# Weather App Đơn Giản - Design Spec (2026-09-16)

## Mục tiêu
App thời tiết siêu đơn giản, toàn text, đúng cấu trúc folder trong `anh/image.png`. Dùng JSON tĩnh tạm thời, chưa gọi API ngoài.

## Hiện trạng
- `App.tsx` đang import `src/context/AuthContext` + `src/navigation/AppNavigator` nhưng `src/` chưa tồn tại -> cần thay thế.
- Project RN 0.87.1, React 19.2.3, đã có `react-native-safe-area-context`.

## Architecture
- Xóa dependency Auth/Navigation khỏi `App.tsx`. `App.tsx` render trực tiếp `HomeScreen`.
- Không thêm lib ngoài. Chỉ dùng core RN: `View`, `Text`, `ScrollView`.
- Data flow một chiều: `mockWeather.json` -> `HomeScreen` -> props xuống 3 components.

## Cấu trúc file (khớp ảnh)
```
src/
  commons/constant.ts        // CITY_DEFAULT = 'Hà Nội'
  utils.ts                   // formatNhietDo(temp) => `${temp}'C` / `${temp}°C`
  data/mockWeather.json      // { city, hienTai, theoGio[], theoNgay[] }
  components/
    ThoiTietHienTai/index.tsx // props { city, temp }
    ThoiTietTheoGio/index.tsx // props { gio, moTa, nhietDo }
    ThoiTietTheoNgay/index.tsx// props { gio, moTa, nhietDo }
  screens/HomeScreen/
    index.tsx                 // layout 2 khối View + 2 ScrollView như ảnh
    styles.ts                 // StyleSheet tách riêng
```

## Components
1. **ThoiTietHienTai**: hiển thị tên thành phố + nhiệt độ lớn, căn giữa. Không logic.
2. **ThoiTietTheoGio**: card nhỏ có border, 3 dòng text: giờ / mô tả / nhiệt độ. Dùng trong ScrollView ngang.
3. **ThoiTietTheoNgay**: row có border bo góc, 1 dòng: giờ bên trái, `Mưa 26'C` bên phải. Dùng trong ScrollView dọc `gap:8`.

## HomeScreen layout (theo code trong ảnh)
- Khối trên: `<View>` chứa `<ThoiTietHienTai/>` + `<ScrollView horizontal>` chứa list `ThoiTietTheoGio`.
- Khối dưới: `<View style={{flex:4, padding:16}}>` chứa `<ScrollView contentContainerStyle={{gap:8}}>` chứa list `ThoiTietTheoNgay`.

## Dữ liệu mock
```json
{
  "city": "Hà Nội",
  "hienTai": { "nhietDo": 26 },
  "theoGio": [{ "gio": "11 giờ", "moTa": "Mưa", "nhietDo": 26 }],
  "theoNgay": [{ "gio": "11 giờ", "moTa": "Mưa", "nhietDo": 26 }]
}
```
Nhân bản 5 item ngang + 7-10 item dọc để giống ảnh. Sau này thay bằng `fetch()` + `useState` mà không sửa component.

## Error handling / Testing
- JSON tĩnh nên không cần loading/error.
- Verify: `npx tsc --noEmit` pass, `yarn start` + chạy iOS/Android hiển thị như ảnh.

## Không làm (YAGNI)
- Không API thật, không geolocation, không navigation, không auth, không icon ảnh, không styling phức tạp.
