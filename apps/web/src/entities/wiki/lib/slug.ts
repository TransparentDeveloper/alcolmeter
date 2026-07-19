// 제목 → URL slug. 공백 제거(메신저에서 %20으로 깨지지 않게), 한글·영문·숫자만 남긴다.
function toSlug(title: string): string {
	return title.trim().replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '');
}

export { toSlug };
