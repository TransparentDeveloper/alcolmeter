import type { WikiVideo } from '$entities/wiki/model';

function isPortraitVideo(video: WikiVideo): boolean {
	return (video.orientation ?? 'portrait') === 'portrait';
}
function videoThumbnails(video: WikiVideo): [string, string] {
	const base = `https://i.ytimg.com/vi/${video.id}`;
	return isPortraitVideo(video)
		? [`${base}/oardefault.jpg`, `${base}/maxresdefault.jpg`]
		: [`${base}/maxresdefault.jpg`, `${base}/hqdefault.jpg`];
}
function videoWatchUrl(video: WikiVideo): string {
	return isPortraitVideo(video)
		? `https://www.youtube.com/shorts/${video.id}`
		: `https://www.youtube.com/watch?v=${video.id}`;
}
function videoEmbedUrl(video: WikiVideo): string {
	return `https://www.youtube.com/embed/${video.id}`;
}

// 입력받은 유튜브 URL에서 id·orientation을 뽑는다. shorts는 portrait로 본다. 못 뽑으면 id=null.
function parseYoutubeUrl(url: string): { id: string | null; orientation: 'portrait' | 'landscape' } {
	const trimmed = url.trim();
	if (!trimmed) return { id: null, orientation: 'landscape' };
	const shorts = trimmed.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
	if (shorts) return { id: shorts[1], orientation: 'portrait' };
	const watch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
	if (watch) return { id: watch[1], orientation: 'landscape' };
	const shortLink = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
	if (shortLink) return { id: shortLink[1], orientation: 'landscape' };
	const embed = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
	if (embed) return { id: embed[1], orientation: 'landscape' };
	const bare = trimmed.match(/^([A-Za-z0-9_-]{11})$/);
	if (bare) return { id: bare[1], orientation: 'landscape' };
	return { id: null, orientation: 'landscape' };
}

export { isPortraitVideo, videoThumbnails, videoWatchUrl, videoEmbedUrl, parseYoutubeUrl };
