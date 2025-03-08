const util = require('./util');
const BASE_VIDEO_URL = 'https://www.youtube.com/watch?v=';

module.exports = item => {
  const type = Object.keys(item)[0];
  switch (type) {
    case 'videoRenderer':
      return parseVideo(item[type]);
    case 'playlistRenderer':
      return parsePlaylist(item[type]);
    case 'gridVideoRenderer':
      return parseVideo(item[type]);
    default:
      return null;
  }
};

const parseVideo = obj => {
  const badges = Array.isArray(obj.badges) ? obj.badges.map(a => a.metadataBadgeRenderer.label) : [];
  const isLive = badges.some(b => ['LIVE NOW', 'LIVE'].includes(b));
  const upcoming = obj.upcomingEventData ? Number(`${obj.upcomingEventData.startTime}000`) : null;
  const lengthFallback = obj.thumbnailOverlays.find(x => Object.keys(x)[0] === 'thumbnailOverlayTimeStatusRenderer');
  const length = obj.lengthText || (lengthFallback && lengthFallback.thumbnailOverlayTimeStatusRenderer.text);

  return {
    type: 'video',
    name: util.parseText(obj.title),
    id: obj.videoId,
    url: BASE_VIDEO_URL + obj.videoId,
    thumbnail: util.prepImg(obj.thumbnail.thumbnails)[0].url,
    thumbnails: util.prepImg(obj.thumbnail.thumbnails),
    isUpcoming: !!upcoming,
    upcoming,
    isLive,
    badges,

    // Author can be null for shows like whBqghP5Oow
    author: _parseAuthor(obj),

    description: util.parseText(obj.descriptionSnippet),

    views: !obj.viewCountText ? null : util.parseIntegerFromText(obj.viewCountText),
    // Duration not provided for live & sometimes with upcoming & sometimes randomly
    duration: util.parseText(length),
    // UploadedAt not provided for live & upcoming & sometimes randomly
    uploadedAt: util.parseText(obj.publishedTimeText),
  };
};

const _parseAuthor = obj => {
  const ctsr = obj.channelThumbnailSupportedRenderers;
  const authorImg = !ctsr ? { thumbnail: { thumbnails: [] } } : ctsr.channelThumbnailWithLinkRenderer;
  const ownerBadgesString = obj.ownerBadges && JSON.stringify(obj.ownerBadges);
  const isOfficial = !!(ownerBadgesString && ownerBadgesString.includes('OFFICIAL'));
  const isVerified = !!(ownerBadgesString && ownerBadgesString.includes('VERIFIED'));
  const author = obj.ownerText && obj.ownerText.runs[0];
  if (!author || !author.navigationEndpoint) return null;
  const authorUrl =
    author.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
    author.navigationEndpoint.commandMetadata.webCommandMetadata.url;
  return {
    name: author.text,
    channelID: author.navigationEndpoint.browseEndpoint.browseId,
    url: new URL(authorUrl, BASE_VIDEO_URL).toString(),
    bestAvatar: util.prepImg(authorImg.thumbnail.thumbnails)[0] || null,
    avatars: util.prepImg(authorImg.thumbnail.thumbnails),
    ownerBadges: Array.isArray(obj.ownerBadges) ? obj.ownerBadges.map(a => a.metadataBadgeRenderer.tooltip) : [],
    verified: isOfficial || isVerified,
  };
};

const parsePlaylist = obj => ({
  type: 'playlist',
  id: obj.playlistId,
  name: util.parseText(obj.title),
  url: `https://www.youtube.com/playlist?list=${obj.playlistId}`,

  owner: _parseOwner(obj),

  publishedAt: util.parseText(obj.publishedTimeText),
  length: Number(obj.videoCount),
});

const _parseOwner = obj => {
  // Auto generated playlists (starting with OL) only provide a simple string
  // Eg: https://www.youtube.com/playlist?list=OLAK5uy_nCItxg-iVIgQUZnPViEyd8xTeRAIr0y5I

  if (obj.shortBylineText.simpleText) return null;
  // Or return { name: obj.shortBylineText.simpleText };

  const owner =
    (obj.shortBylineText && obj.shortBylineText.runs[0]) || (obj.longBylineText && obj.longBylineText.runs[0]);

  if (!owner.navigationEndpoint) return null;
  // Or return { name: owner.text };

  const ownerUrl =
    owner.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
    owner.navigationEndpoint.commandMetadata.webCommandMetadata.url;
  const ownerBadgesString = obj.ownerBadges && JSON.stringify(obj.ownerBadges);
  const isOfficial = !!(ownerBadgesString && ownerBadgesString.includes('OFFICIAL'));
  const isVerified = !!(ownerBadgesString && ownerBadgesString.includes('VERIFIED'));
  const fallbackURL = owner.navigationEndpoint.commandMetadata.webCommandMetadata.url;

  return {
    name: owner.text,
    channelID: owner.navigationEndpoint.browseEndpoint.browseId,
    url: new URL(ownerUrl || fallbackURL, BASE_VIDEO_URL).toString(),
    ownerBadges: Array.isArray(obj.ownerBadges) ? obj.ownerBadges.map(a => a.metadataBadgeRenderer.tooltip) : [],
    verified: isOfficial || isVerified,
  };
};
