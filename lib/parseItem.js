const UTIL = require('./util');
const BASE_VIDEO_URL = 'https://www.youtube.com/watch?v=';
const URL = require('url').URL;

module.exports = item => {
  const type = Object.keys(item)[0];
  try {
    switch (type) {
      case 'videoRenderer':
        return parseVideo(item[type]);
      case 'playlistRenderer':
        return parsePlaylist(item[type]);
      default:
        return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const parseVideo = obj => {
  if (!obj.videoId || obj.upcomingEventData) return null;
  const author = obj.ownerText && obj.ownerText.runs[0];
  let authorUrl = null;
  if (author) {
    authorUrl = author.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
      author.navigationEndpoint.commandMetadata.webCommandMetadata.url;
  }
  const badges = Array.isArray(obj.badges) ? obj.badges.map(a => a.metadataBadgeRenderer.label) : [];
  const isLive = badges.some(b => b === 'LIVE NOW');
  const authorThumbnails = obj.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails;
  const isOfficial = !!(obj.ownerBadges && JSON.stringify(obj.ownerBadges).includes('OFFICIAL'));
  const isVerified = !!(obj.ownerBadges && JSON.stringify(obj.ownerBadges).includes('VERIFIED'));

  return {
    type: 'video',
    name: UTIL.parseText(obj.title),
    id: obj.videoId,
    url: BASE_VIDEO_URL + obj.videoId,
    thumbnail: UTIL.sortImg(obj.thumbnail.thumbnails)[0].url,
    isLive,
    badges,

    // Author can be null for shows like whBqghP5Oow
    author: author ? {
      name: author.text,
      channelID: author.navigationEndpoint.browseEndpoint.browseId,
      url: new URL(authorUrl, BASE_VIDEO_URL).toString(),
      bestAvatar: UTIL.sortImg(authorThumbnails)[0],
      avatars: UTIL.sortImg(authorThumbnails),
      ownerBadges: Array.isArray(obj.ownerBadges) ? obj.ownerBadges.map(a => a.metadataBadgeRenderer.tooltip) : [],
      verified: isOfficial || isVerified,
    } : null,

    description: obj.descriptionSnippet ? UTIL.parseText(obj.descriptionSnippet) : null,

    views: !obj.viewCountText ? null : UTIL.parseIntegerFromText(obj.viewCountText),
    duration: isLive ? 'Live' : !obj.lengthText ? null : UTIL.parseText(obj.lengthText),
    uploadedAt: !obj.publishedTimeText ? null : UTIL.parseText(obj.publishedTimeText),
  };
};

const parsePlaylist = obj => ({
  type: 'playlist',
  id: obj.playlistId,
  name: UTIL.parseText(obj.title),
  url: `https://www.youtube.com/playlist?list=${obj.playlistId}`,
  length: UTIL.parseIntegerFromText(obj.videoCount),
  owner: obj.shortBylineText.simpleText || obj.longBylineText.simpleText ? null : parseOwner(obj),
});

/**
 * Generalised Method
 *
 * used in Playlist, Movie and Show
 * show does never provide badges thou
 *
 * @param {Object} obj the full Renderer Object provided by YouTube
 * @returns {Object} the parsed owner
 */
const parseOwner = obj => {
  const owner = (obj.shortBylineText && obj.shortBylineText.runs[0]) ||
    (obj.longBylineText && obj.longBylineText.runs[0]);
  const ownerUrl = owner.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
    owner.navigationEndpoint.commandMetadata.webCommandMetadata.url;
  const isOfficial = !!(obj.ownerBadges && JSON.stringify(obj.ownerBadges).includes('OFFICIAL'));
  const isVerified = !!(obj.ownerBadges && JSON.stringify(obj.ownerBadges).includes('VERIFIED'));
  const fallbackURL = owner.navigationEndpoint.commandMetadata.webCommandMetadata.url;

  return {
    name: owner.text,
    channelID: owner.navigationEndpoint.browseEndpoint.browseId,
    url: new URL(ownerUrl || fallbackURL, BASE_VIDEO_URL).toString(),
    ownerBadges: Array.isArray(obj.ownerBadges) ? obj.ownerBadges.map(a => a.metadataBadgeRenderer.tooltip) : [],
    verified: isOfficial || isVerified,
  };
};
