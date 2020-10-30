const UTIL = require('./util.js');
const API_URL = 'https://www.youtube.com/youtubei/v1/search?key=';

const main = module.exports = async (searchString, options = {}) => {
  options = UTIL.checkArgs(searchString, options);
  // Required options
  Object.assign(options, await UTIL.fetchAPIKey());
  const data = await UTIL.doPost(API_URL + options.key, UTIL.buildPostBody(searchString, options));
  // Parse the response data, remove null items
  let resp = options.continuation ? UTIL.parseContinuation(data) : UTIL.parseData(data);
  resp.items = resp.items.filter(a => a).filter((_, index) => index < options.limit);
  // Adjust tracker
  options.limit -= resp.items.length;
  resp.query = searchString;
  if (!resp.continuation || options.limit < 1) return resp;
  // Recursively fetch more items
  options.continuation = resp.continuation;
  const nestedResp = await main(searchString, options);
  // Merge the responses
  resp.items.push(...nestedResp.items);
  resp.continuation = nestedResp.continuation;
  return resp;
};

// eslint-disable-next-line no-empty-function
UTIL.fetchAPIKey().catch(() => { });
