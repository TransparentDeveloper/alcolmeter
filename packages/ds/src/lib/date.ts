const dateFormat = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', timeZone: 'Asia/Seoul' });

export function formatDate(date: Date) {
  return dateFormat.format(date);
}
