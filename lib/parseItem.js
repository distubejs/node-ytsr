const UTIL = require('./util');

module.exports = item => {
  const type = Object.keys(item)[0];
  try {
    switch (type) {
      case 'videoRenderer':
        return parseVideo(item[type]);
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
};

const parseVideo = obj => {
  if (!obj.videoId || obj.upcomingEventData) return null;
  const badges = Array.isArray(obj.badges) ? obj.badges.map(a => a.metadataBadgeRenderer.label) : [];
  const isLive = badges.some(b => b === 'LIVE NOW');
  return {
    name: UTIL.parseText(obj.title),
    id: obj.videoId,
    url: `https://www.youtube.com/watch?v=${obj.videoId}`,
    thumbnail: obj.thumbnail.thumbnails.sort((a, b) => b.width - a.width)[0].url,
    views: !obj.viewCountText ? 0 : UTIL.parseIntegerFromText(obj.viewCountText),
    duration: isLive ? 'Live' : !obj.lengthText ? 'xx:xx' : UTIL.parseText(obj.lengthText),
    isLive,
  };
};
