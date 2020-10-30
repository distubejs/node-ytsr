const UTIL = require('./util');

module.exports = item => {
  const type = Object.keys(item)[0];
  switch (type) {
    case 'videoRenderer':
      return parseVideo(item[type]);
    default:
      return null;
  }
};

const parseVideo = obj => {
  const badges = Array.isArray(obj.badges) ? obj.badges.map(a => a.metadataBadgeRenderer.label) : [];
  const isLive = badges.some(b => b === 'LIVE NOW');
  if (obj.upcomingEventData) return null;
  return {
    name: UTIL.parseText(obj.title),
    id: obj.videoId,
    url: `https://www.youtube.com/watch?v=${obj.videoId}`,
    thumbnail: obj.thumbnail.thumbnails.sort((a, b) => b.width - a.width)[0].url,
    views: !obj.viewCountText ? null : UTIL.parseNumFromText(obj.viewCountText),
    duration: isLive || !obj.lengthText ? null : UTIL.parseText(obj.lengthText),
    isLive,
  };
};
