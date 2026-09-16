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
