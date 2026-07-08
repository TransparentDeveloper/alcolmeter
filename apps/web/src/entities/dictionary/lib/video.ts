import type { TermVideo } from '../model';

/** 쇼츠(세로)인가. orientation 미지정 시 기본 portrait. */
export function isPortraitVideo(video: TermVideo): boolean {
	return (video.orientation ?? 'portrait') === 'portrait';
}

/**
 * 썸네일 URL 후보 [기본, 폴백]. 표시(첫 항목 + onerror 폴백)와 VideoObject.thumbnailUrl에 공용.
 * 쇼츠는 세로 oardefault, 일반 영상은 16:9 maxresdefault를 우선한다.
 */
export function videoThumbnails(video: TermVideo): [string, string] {
	const base = `https://i.ytimg.com/vi/${video.id}`;
	return isPortraitVideo(video)
		? [`${base}/oardefault.jpg`, `${base}/maxresdefault.jpg`]
		: [`${base}/maxresdefault.jpg`, `${base}/hqdefault.jpg`];
}

/** 시청 페이지 URL. 쇼츠는 /shorts/, 일반 영상은 /watch?v=. */
export function videoWatchUrl(video: TermVideo): string {
	return isPortraitVideo(video)
		? `https://www.youtube.com/shorts/${video.id}`
		: `https://www.youtube.com/watch?v=${video.id}`;
}

/** 임베드(iframe·VideoObject.embedUrl) URL. 방향 무관. */
export function videoEmbedUrl(video: TermVideo): string {
	return `https://www.youtube.com/embed/${video.id}`;
}
