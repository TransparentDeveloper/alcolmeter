import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRealReadyAt } from './ready-at.ts';

test('달력에 있는 시각은 받는다', () => {
  for (const value of [
    '2026-10-19T14:30+09:00',
    '2026-02-28T23:59+14:00',
    '2028-02-29T00:00Z',
    '2026-12-31T14:30+09:00',
    '2026-10-19T14:30+05:59',
    '2026-10-19T00:00-14:00',
  ]) {
    assert.equal(isRealReadyAt(value), true, value);
  }
});

test('형식이 틀리면 받지 않는다', () => {
  for (const value of ['2026-10-19', '2026-10-19T14:30', '2026-10-19T14:30:00+09:00', '2026-10-19 14:30+09:00']) {
    assert.equal(isRealReadyAt(value), false, value);
  }
});

test('달력에 없는 날짜와 시각은 받지 않는다', () => {
  for (const value of [
    '2026-02-29T14:30+09:00',
    '2026-02-30T14:30+09:00',
    '2026-04-31T14:30+09:00',
    '2026-13-01T14:30+09:00',
    '2026-00-10T14:30+09:00',
    '2026-10-00T14:30+09:00',
    '2026-10-19T24:00+09:00',
    '2026-10-19T12:60+09:00',
    '2026-10-19T14:30+15:00',
    '2026-10-19T14:30-15:00',
    '2026-10-19T14:30+09:60',
  ]) {
    assert.equal(isRealReadyAt(value), false, value);
  }
});
