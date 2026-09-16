import { formatNhietDo } from '../src/utils';

test('formatNhietDo tra ve 26°C', () => {
  expect(formatNhietDo(26)).toBe('26°C');
});
