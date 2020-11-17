const URL = require('url');

const BASE_URL = 'https://www.youtube.com/';
const DEFAULT_OPTIONS = { limit: 100, safeSearch: false, nextpageRef: null };
const DEFAULT_QUERY = { gl: 'US', hl: 'en' };
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

exports.parseBody = (body, options = {}) => {
  const str = between(body, 'var ytInitialData =', '; \n');
  const apiKey = between(body, 'INNERTUBE_API_KEY":"', '"') || between(body, 'innertubeApiKey":"', '"');
  const clientVersion = between(body, 'INNERTUBE_CONTEXT_CLIENT_VERSION":"', '"') ||
    between(body, 'innertube_context_client_version":"', '"');
  const context = JSON.parse(JSON.stringify(DEFAULT_CONTEXT));
  context.client.clientVersion = clientVersion;
  if (options.gl) body.context.client.gl = options.gl;
  if (options.hl) body.context.client.hl = options.hl;
  if (options.utcOffsetMinutes) body.context.client.utcOffsetMinutes = options.utcOffsetMinutes;
  if (options.safeSearch) body.context.user.enableSafetyMode = true;
  return { json: JSON.parse(str || null), apiKey, context };
};

// Parsing utility
const parseText = exports.parseText = txt => txt.simpleText || txt.runs.map(a => a.text).join('');

exports.parseNumFromText = txt => Number(parseText(txt).replace(/\D+/g, ''));

// Request Utility
exports.doPost = (url, reqOpts, payload) => new Promise(resolve => {
  // Enforce POST-Request
  reqOpts.method = 'POST';
  const req = require('https').request(url, reqOpts);
  req.on('response', resp => {
    const body = [];
    resp.on('data', chunk => body.push(chunk));
    resp.on('end', () => {
      resolve(JSON.parse(Buffer.concat(body).toString()));
    });
  });
  req.write(JSON.stringify(payload));
  req.end();
});

// Guarantee that all arguments are valid
exports.checkArgs = (searchString, options = {}) => {
  // Validation
  if (!searchString) {
    throw new Error('search string is mandatory');
  }
  if (searchString && typeof searchString !== 'string') {
    throw new Error('search string must be of type string');
  }

  // Normalisation
  let obj = Object.assign({}, DEFAULT_OPTIONS, options);
  if (isNaN(obj.limit) || obj.limit <= 0) obj.limit = DEFAULT_OPTIONS.limit;
  if (typeof obj.safeSearch !== 'boolean') obj.safeSearch = DEFAULT_OPTIONS.safeSearch;
  // Setting cookie in request headers to get safe search results
  if (obj.safeSearch) {
    if (!obj.headers) obj.headers = {};
    if (!obj.headers.Cookie) obj.headers.Cookie = [];
    obj.headers.Cookie.push('PREF=f2=8000000');
  }
  // Watch out for previous filter requests
  // in such a case searchString would be an url including `sp` & `search_query` querys
  obj.query = searchString.startsWith(BASE_URL) ? URL.parse(searchString, true).query : { search_query: searchString };
  obj.search = obj.query.search_query;

  obj.query = Object.assign({}, DEFAULT_QUERY, obj.query);
  if (options && options.gl) obj.query.gl = options.gl;
  if (options && options.hl) obj.query.hl = options.hl;
  return obj;
};

// Taken from https://github.com/fent/node-ytdl-core/
const between = exports.between = (haystack, left, right) => {
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
