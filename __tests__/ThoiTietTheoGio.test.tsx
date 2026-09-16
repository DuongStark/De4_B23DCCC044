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
