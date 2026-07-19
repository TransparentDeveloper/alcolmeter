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

export { isPortraitVideo, videoThumbnails, videoWatchUrl, videoEmbedUrl };
