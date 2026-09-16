# Weather App Đơn Giản Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng app thời tiết text-only đúng cấu trúc `anh/image.png`, dùng JSON tĩnh.

**Architecture:** `App.tsx` render `HomeScreen`; `HomeScreen` đọc `src/data/mockWeather.json` và truyền props xuống 3 components presentational; styles tách riêng.

**Tech Stack:** React Native 0.87.1, React 19.2.3, TypeScript, Jest + react-test-renderer, StyleSheet core.

---

## File Structure

- Create: `src/data/mockWeather.json` — dữ liệu tĩnh Hà Nội 26 độ
- Create: `src/commons/constant.ts` — `CITY_DEFAULT`
- Create: `src/utils.ts` — `formatNhietDo()`
- Create: `src/components/ThoiTietHienTai/index.tsx` — header city + temp
- Create: `src/components/ThoiTietTheoGio/index.tsx` — card ngang
- Create: `src/components/ThoiTietTheoNgay/index.tsx` — row dọc
- Create: `src/screens/HomeScreen/index.tsx` — layout 2 khối như ảnh
- Create: `src/screens/HomeScreen/styles.ts` — StyleSheet
- Modify: `App.tsx` — bỏ Auth/Navigation, render HomeScreen
- Test: `__tests__/utils.test.ts`, `__tests__/ThoiTietHienTai.test.tsx`, `__tests__/ThoiTietTheoGio.test.tsx`, `__tests__/ThoiTietTheoNgay.test.tsx`, `__tests__/HomeScreen.test.tsx`

---

### Task 1: Dữ liệu mock + commons + utils

**Files:**
- Create: `src/data/mockWeather.json`
- Create: `src/commons/constant.ts`
- Create: `src/utils.ts`
- Test: `__tests__/utils.test.ts`

- [ ] **Step 1: Viết test fail cho utils**

```tsx
// __tests__/utils.test.ts
import { formatNhietDo } from '../src/utils';

test('formatNhietDo tra ve 26°C', () => {
  expect(formatNhietDo(26)).toBe('26°C');
});
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npm test -- __tests__/utils.test.ts 2>&1 | head -n 30`
Expected: FAIL với "Cannot find module '../src/utils'"

- [ ] **Step 3: Tạo mock JSON + constant + utils tối thiểu**

```json
// src/data/mockWeather.json
{
  "city": "Hà Nội",
  "hienTai": { "nhietDo": 26 },
  "theoGio": [
    { "gio": "11 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "12 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "13 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "14 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "15 giờ", "moTa": "Mưa", "nhietDo": 26 }
  ],
  "theoNgay": [
    { "gio": "11 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "12 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "13 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "14 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "15 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "16 giờ", "moTa": "Mưa", "nhietDo": 26 },
    { "gio": "17 giờ", "moTa": "Mưa", "nhietDo": 26 }
  ]
}
```

```ts
// src/commons/constant.ts
export const CITY_DEFAULT = 'Hà Nội';
```

```ts
// src/utils.ts
export function formatNhietDo(nhietDo: number): string {
  return `${nhietDo}°C`;
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `npm test -- __tests__/utils.test.ts 2>&1 | tail -n 15`
Expected: PASS, 1 test passed

- [ ] **Step 5: Chạy typecheck**

Run: `npx tsc --noEmit 2>&1 | head -n 20`
Expected: không báo lỗi (hoặc chỉ lỗi App.tsx cũ, sẽ sửa ở Task 6)

- [ ] **Step 6: Commit**

```bash
git add src/data/mockWeather.json src/commons/constant.ts src/utils.ts __tests__/utils.test.ts
git commit -m "feat: add mock weather data and utils"
```

---

### Task 2: Component ThoiTietHienTai

**Files:**
- Create: `src/components/ThoiTietHienTai/index.tsx`
- Test: `__tests__/ThoiTietHienTai.test.tsx`

- [ ] **Step 1: Viết failing test**

```tsx
// __tests__/ThoiTietHienTai.test.tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ThoiTietHienTai from '../src/components/ThoiTietHienTai';

test('hien thi ten thanh pho va nhiet do', async () => {
  let root: any;
  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(<ThoiTietHienTai city="Hà Nội" nhietDo={26} />);
  });
  const text = JSON.stringify(root.toJSON());
  expect(text).toMatch('Hà Nội');
  expect(text).toMatch('26°C');
});
```

- [ ] **Step 2: Chạy test xác nhận fail**

Run: `npm test -- __tests__/ThoiTietHienTai.test.tsx 2>&1 | head -n 30`
Expected: FAIL "Cannot find module"

- [ ] **Step 3: Viết implementation tối thiểu**

```tsx
// src/components/ThoiTietHienTai/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  city: string;
  nhietDo: number;
};

export default function ThoiTietHienTai({ city, nhietDo }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{formatNhietDo(nhietDo)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 24 },
  city: { fontSize: 18 },
  temp: { fontSize: 48, fontWeight: '600' },
});
```

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npm test -- __tests__/ThoiTietHienTai.test.tsx 2>&1 | tail -n 15`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThoiTietHienTai/index.tsx __tests__/ThoiTietHienTai.test.tsx
git commit -m "feat: add ThoiTietHienTai component"
```

---

### Task 3: Component ThoiTietTheoGio

**Files:**
- Create: `src/components/ThoiTietTheoGio/index.tsx`
- Test: `__tests__/ThoiTietTheoGio.test.tsx`

- [ ] **Step 1: Viết failing test**

```tsx
// __tests__/ThoiTietTheoGio.test.tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ThoiTietTheoGio from '../src/components/ThoiTietTheoGio';

test('hien thi gio, mo ta, nhiet do', async () => {
  let root: any;
  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(<ThoiTietTheoGio gio="11 giờ" moTa="Mưa" nhietDo={26} />);
  });
  const text = JSON.stringify(root.toJSON());
  expect(text).toMatch('11 giờ');
  expect(text).toMatch('Mưa');
  expect(text).toMatch('26°C');
});
```

- [ ] **Step 2: Chạy test xác nhận fail**

Run: `npm test -- __tests__/ThoiTietTheoGio.test.tsx 2>&1 | head -n 30`
Expected: FAIL "Cannot find module"

- [ ] **Step 3: Viết implementation**

```tsx
// src/components/ThoiTietTheoGio/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  gio: string;
  moTa: string;
  nhietDo: number;
};

export default function ThoiTietTheoGio({ gio, moTa, nhietDo }: Props) {
  return (
    <View style={styles.card}>
      <Text>{gio}</Text>
      <Text style={styles.moTa}>{moTa}</Text>
      <Text>{formatNhietDo(nhietDo)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  moTa: { fontWeight: '600', marginVertical: 4 },
});
```

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npm test -- __tests__/ThoiTietTheoGio.test.tsx 2>&1 | tail -n 15`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThoiTietTheoGio/index.tsx __tests__/ThoiTietTheoGio.test.tsx
git commit -m "feat: add ThoiTietTheoGio component"
```

---

### Task 4: Component ThoiTietTheoNgay

**Files:**
- Create: `src/components/ThoiTietTheoNgay/index.tsx`
- Test: `__tests__/ThoiTietTheoNgay.test.tsx`

- [ ] **Step 1: Viết failing test**

```tsx
// __tests__/ThoiTietTheoNgay.test.tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ThoiTietTheoNgay from '../src/components/ThoiTietTheoNgay';

test('hien thi row gio va mo ta nhiet do', async () => {
  let root: any;
  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(<ThoiTietTheoNgay gio="11 giờ" moTa="Mưa" nhietDo={26} />);
  });
  const text = JSON.stringify(root.toJSON());
  expect(text).toMatch('11 giờ');
  expect(text).toMatch('Mưa');
  expect(text).toMatch('26°C');
});
```

- [ ] **Step 2: Chạy test xác nhận fail**

Run: `npm test -- __tests__/ThoiTietTheoNgay.test.tsx 2>&1 | head -n 30`
Expected: FAIL "Cannot find module"

- [ ] **Step 3: Viết implementation**

```tsx
// src/components/ThoiTietTheoNgay/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  gio: string;
  moTa: string;
  nhietDo: number;
};

export default function ThoiTietTheoNgay({ gio, moTa, nhietDo }: Props) {
  return (
    <View style={styles.row}>
      <Text>{gio}</Text>
      <Text>
        {moTa} {formatNhietDo(nhietDo)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
```

- [ ] **Step 4: Chạy test xác nhận pass**

Run: `npm test -- __tests__/ThoiTietTheoNgay.test.tsx 2>&1 | tail -n 15`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThoiTietTheoNgay/index.tsx __tests__/ThoiTietTheoNgay.test.tsx
git commit -m "feat: add ThoiTietTheoNgay component"
```

---

### Task 5: HomeScreen + styles

**Files:**
- Create: `src/screens/HomeScreen/index.tsx`
- Create: `src/screens/HomeScreen/styles.ts`
- Test: `__tests__/HomeScreen.test.tsx`

- [ ] **Step 1: Viết failing test**

```tsx
// __tests__/HomeScreen.test.tsx
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import HomeScreen from '../src/screens/HomeScreen';

test('HomeScreen render du 3 khoi', async () => {
  let root: any;
  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(<HomeScreen />);
  });
  const text = JSON.stringify(root.toJSON());
  expect(text).toMatch('Hà Nội');
  expect(text).toMatch('Mưa');
  expect(text).toMatch('26°C');
});
```

- [ ] **Step 2: Chạy test xác nhận fail**

Run: `npm test -- __tests__/HomeScreen.test.tsx 2>&1 | head -n 30`
Expected: FAIL "Cannot find module"

- [ ] **Step 3: Viết styles**

```ts
// src/screens/HomeScreen/styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  top: { flex: 1 },
  bottom: { flex: 4, padding: 16 },
  gioList: { paddingHorizontal: 16 },
});
```

- [ ] **Step 4: Viết HomeScreen implementation**

```tsx
// src/screens/HomeScreen/index.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import ThoiTietHienTai from '../../components/ThoiTietHienTai';
import ThoiTietTheoGio from '../../components/ThoiTietTheoGio';
import ThoiTietTheoNgay from '../../components/ThoiTietTheoNgay';
import mockData from '../../data/mockWeather.json';
import styles from './styles';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <ThoiTietHienTai city={mockData.city} nhietDo={mockData.hienTai.nhietDo} />
        <ScrollView horizontal contentContainerStyle={styles.gioList}>
          {mockData.theoGio.map((item, idx) => (
            <ThoiTietTheoGio key={idx} gio={item.gio} moTa={item.moTa} nhietDo={item.nhietDo} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottom}>
        <ScrollView contentContainerStyle={{ gap: 8 }}>
          {mockData.theoNgay.map((item, idx) => (
            <ThoiTietTheoNgay key={idx} gio={item.gio} moTa={item.moTa} nhietDo={item.nhietDo} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
```

- [ ] **Step 5: Chạy test xác nhận pass**

Run: `npm test -- __tests__/HomeScreen.test.tsx 2>&1 | tail -n 15`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/screens/HomeScreen/index.tsx src/screens/HomeScreen/styles.ts __tests__/HomeScreen.test.tsx
git commit -m "feat: add HomeScreen layout"
```

---

### Task 6: Nối App.tsx + verify cuối

**Files:**
- Modify: `App.tsx`
- Test: `__tests__/App.test.tsx` (sửa lại, có sẵn)

- [ ] **Step 1: Chạy test App hiện tại để thấy fail**

Run: `npm test -- __tests__/App.test.tsx 2>&1 | head -n 40`
Expected: FAIL vì thiếu `src/context/AuthContext`

- [ ] **Step 2: Sửa App.tsx tối thiểu**

```tsx
// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Chạy toàn bộ test**

Run: `npm test 2>&1 | tail -n 20`
Expected: tất cả PASS (6 suites)

- [ ] **Step 4: Chạy typecheck**

Run: `npx tsc --noEmit 2>&1 | head -n 20`
Expected: không lỗi

- [ ] **Step 5: Commit**

```bash
git add App.tsx __tests__/App.test.tsx
git commit -m "feat: wire App to HomeScreen"
```
