const PARSE_ITEM = require('./parseItem.js');
const MINIGET = require('miniget');
const UTIL = require('./util.js');
const QS = require('querystring');

const BASE_SEARCH_URL = 'https://www.youtube.com/results?';
const BASE_API_URL = 'https://www.youtube.com/youtubei/v1/search?key=';

const main = module.exports = async(searchString, options) => {
  const opts = UTIL.checkArgs(searchString, options);

  const ref = BASE_SEARCH_URL + QS.encode(opts.query);
  const body = await MINIGET(ref, opts).text();
  const parsed = UTIL.parseBody(body, opts);
  // Retry if old response
  if (!parsed.json) return main(searchString, options);

  const resp = {
    query: opts.search,
  };

  // General wrapper
  const wrapper = parsed.json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;

  // Parse items
  const rawItems = wrapper.contents.find(x => Object.keys(x)[0] === 'itemSectionRenderer').itemSectionRenderer.contents;
  resp.items = rawItems.map(PARSE_ITEM).filter(a => a).filter((_, index) => index < opts.limit);

  // Adjust tracker
  opts.limit -= resp.items.length;

  // Get amount of results
  resp.results = Number(parsed.json.estimatedResults) || 0;

  // Parse the nextpageToken
  const continuation = wrapper.contents.find(x => Object.keys(x)[0] === 'continuationItemRenderer');
  const token = continuation ?
    continuation.continuationItemRenderer.continuationEndpoint.continuationCommand.token : null;

  // We're already on last page or hit the limit
  if (!token || opts.limit < 1) return resp;

  // Recursively fetch more items
  const nestedResp = await parsePage2(parsed.apiKey, token, parsed.context, opts);

  // Merge the responses
  resp.items.push(...nestedResp);
  return resp;
};

const parsePage2 = async(apiKey, token, context, opts) => {
  const json = await UTIL.doPost(BASE_API_URL + apiKey, opts, { context: context, continuation: token });

  const wrapper = json.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;

  // Parse items
  const rawItems = wrapper.find(x => Object.keys(x)[0] === 'itemSectionRenderer').itemSectionRenderer.contents;
  const parsedItems = rawItems.map(PARSE_ITEM).filter(a => a).filter((_, index) => index < opts.limit);

  // Adjust tracker
  opts.limit -= parsedItems.length;

  // Parse the nextpageToken
  const continuation = wrapper.find(x => Object.keys(x)[0] === 'continuationItemRenderer');
  const nextToken = continuation ?
    continuation.continuationItemRenderer.continuationEndpoint.continuationCommand.token : '';

  // We're already on last page or hit the limit
  if (!nextToken || opts.limit < 1) return parsedItems;

  // Recursively fetch more items
  const nestedResp = await parsePage2(apiKey, nextToken, context, opts);
  parsedItems.push(...nestedResp);
  return parsedItems;
};
