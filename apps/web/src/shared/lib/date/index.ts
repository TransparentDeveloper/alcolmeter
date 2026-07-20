// ISO 날짜 문자열을 'YYYY.MM.DD'로 표시한다. 홈 피드·하이라이트 등에서 공용.
function formatDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '';
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}.${mm}.${dd}`;
}

export { formatDate };
