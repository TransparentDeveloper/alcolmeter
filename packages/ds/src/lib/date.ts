const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', timeZone: 'Asia/Seoul' });

export function formatDate(date: Date) {
  return dateFormat.format(date);
}

const yearMonthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function formatYearMonth(value: string) {
  const match = yearMonthPattern.exec(value);
  if (!match) return undefined;
  return `${match[1]}년 ${Number(match[2])}월`;
}
