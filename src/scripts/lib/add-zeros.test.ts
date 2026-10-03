import { addZeros } from './add-zeros';

test.each([
  [0, 2, '00'],
  [7, 3, '007'],
  [123, 2, '123'],
  [7, 0, '7'],
])('pads %s to width %s', (value, width, expected) => {
  expect(addZeros(value, width)).toBe(expected);
});
