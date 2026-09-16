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
