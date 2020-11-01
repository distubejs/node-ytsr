const parseItem = require('./parseItem');
const MINIGET = require('miniget');
const QS = require('querystring');
const API_KEY = {};
const DEFAULT_OPTIONS = { limit: 100, safeSearch: false, continuation: null };
const DEFAULT_CONTEXT = {
  client: {
    utcOffsetMinutes: 0,
    gl: 'US',
    hl: 'en',
    clientName: 'WEB',
    clientVersion: '<important information>',
  },
  user: {},
  request: {},
};

// Parsing utility
const parseText = exports.parseText = txt => txt.simpleText || txt.runs.map(a => a.text).join('') || '';

exports.parseNumFromText = txt => Number(parseText(txt).replace(/[^0-9]+/g, '')) || 0;

// Request Utility
exports.doPost = (url, payload, reqOpts = {}) => new Promise((resolve, reject) => {
  // Enforce POST-Request
  reqOpts.method = 'POST';
  const req = require('https').request(url, reqOpts);
  req.on('response', resp => {
    const body = [];
    resp.on('data', chunk => body.push(chunk));
    resp.on('end', () => {
      let response = JSON.parse(Buffer.concat(body).toString());
      if (response.error) reject(JSON.stringify(response.error));
      resolve(JSON.parse(Buffer.concat(body).toString()));
    });
  });
  req.write(JSON.stringify(payload));
  req.end();
});

// Guarantee that all arguments are valid
exports.checkArgs = (searchString, options = {}) => {
  // Validation
  if (!searchString && !options.continuation) {
    throw new Error('search string or continuation is mandatory');
  }
  if (searchString && typeof searchString !== 'string') {
    throw new Error('search string must be of type string');
  } else if (options.continuation && typeof options.continuation !== 'string') {
    throw new Error('continuation must be of type string');
  }

  // Normalization
  let obj = Object.assign({}, DEFAULT_OPTIONS, options);
  if (isNaN(obj.limit) || obj.limit <= 0) obj.limit = DEFAULT_OPTIONS.limit;
  if (typeof obj.safeSearch !== 'boolean') obj.safeSearch = DEFAULT_OPTIONS.safeSearch;
  obj.query = searchString;
  return obj;
};

// Taken from https://github.com/fent/node-ytdl-core/
const between = (haystack, left, right) => {
  let pos;
  pos = haystack.indexOf(left);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(pos + left.length);
  if (!right) { return haystack; }
  pos = haystack.indexOf(right);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(0, pos);
  return haystack;
};

exports.buildContext = (options = {}) => {
  let context = DEFAULT_CONTEXT;
  if (!options) return context;
  if (options.gl) context.client.gl = options.gl;
  if (options.hl) context.client.hl = options.hl;
  if (options.utcOffsetMinutes) context.client.utcOffsetMinutes = options.utcOffsetMinutes;
  if (options.safeSearch) context.user.enableSafetyMode = true;
  return context;
};

exports.parseData = json => {
  const wrapper = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer;
  const items = wrapper.contents.find(x => Object.keys(x)[0] === 'itemSectionRenderer').itemSectionRenderer.contents;
  const continuation = wrapper.contents.find(x => Object.keys(x)[0] === 'continuationItemRenderer');
  let token = continuation ? continuation.continuationItemRenderer.continuationEndpoint.continuationCommand.token : '';

  return {
    query: null,
    items: items.map(parseItem),
    results: Number(json.estimatedResults),
    continuation: token,
  };
};

exports.parseContinuation = json => {
  const continuationItems = json.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems;
  const items = continuationItems.find(x => Object.keys(x)[0] === 'itemSectionRenderer').itemSectionRenderer.contents;
  const continuation = continuationItems.find(x => Object.keys(x)[0] === 'continuationItemRenderer');
  let token = continuation ? continuation.continuationItemRenderer.continuationEndpoint.continuationCommand.token : '';

  return {
    query: null,
    items: items.map(parseItem),
    continuation: token,
  };
};

const fetchAPIKey = exports.fetchAPIKey = async (retried = 0) => {
  if (API_KEY.key) return API_KEY;
  if (API_KEY.key === null && retried === 0) {
    await new Promise(r => setTimeout(r, 250));
    return fetchAPIKey();
  }
  API_KEY.key = null;
  const body = await MINIGET(`https://www.youtube.com/results?${QS.encode({ search_query: 'search' })}`).text();
  API_KEY.key = between(body, 'INNERTUBE_API_KEY":"', '"') || between(body, 'innertubeApiKey":"', '"');
  if (!API_KEY.key) {
    if (retried > 3) throw new Error('Could not find innertube API key.');
    return fetchAPIKey(++retried);
  }
  DEFAULT_CONTEXT.client.clientVersion = between(body, 'INNERTUBE_CONTEXT_CLIENT_VERSION":"', '"') ||
    between(body, 'innertube_context_client_version":"', '"');
  return API_KEY;
};
