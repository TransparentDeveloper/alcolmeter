export const READY_AT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(Z|[+-](\d{2}):(\d{2}))$/;
export const READY_AT_ERROR = 'readyAt 은 2026-10-19T14:30+09:00 형식의 실제 있는 시각으로 쓴다.';

// 형식만 맞고 달력에 없는 값(2월 30일, 24시)은 Date 가 다음 날로 넘겨 버리므로 칸마다 범위를 본다.
// 시간대는 대략적인 범위(시 14 이하)만 본다.
export function isRealReadyAt(value: string) {
  const match = READY_AT.exec(value);
  if (!match) return false;
  const [, y, mo, d, h, mi, , oh = '0', om = '0'] = match;
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  return (
    date.getUTCMonth() === Number(mo) - 1 &&
    date.getUTCDate() === Number(d) &&
    Number(h) < 24 &&
    Number(mi) < 60 &&
    Number(oh) <= 14 &&
    Number(om) < 60
  );
}
