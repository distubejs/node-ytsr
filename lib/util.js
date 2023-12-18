const { request } = require('undici');
const PATH = require('path');
const FS = require('fs');

const BASE_URL = 'https://www.youtube.com/';
const DEFAULT_OPTIONS = { limit: 10, safeSearch: false };
const DEFAULT_QUERY = { gl: 'US', hl: 'en' };
const DEFAULT_CONTEXT = {
  client: {
    utcOffsetMinutes: -300,
    gl: 'US',
    hl: 'en',
    clientName: 'WEB',
    clientVersion: '<important information>',
  },
  user: {},
  request: {},
};
const CONSENT_COOKIE = 'SOCS=CAI';

const tryParseBetween = (body, left, right, addEndCurly = false) => {
  try {
    let data = between(body, left, right);
    if (!data) return null;
    if (addEndCurly) data += '}';
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

exports.parseBody = (body, options = {}) => {
  const json =
    tryParseBetween(body, 'var ytInitialData = ', '};', true) ||
    tryParseBetween(body, 'window["ytInitialData"] = ', '};', true) ||
    tryParseBetween(body, 'var ytInitialData = ', ';</script>') ||
    tryParseBetween(body, 'window["ytInitialData"] = ', ';</script>');
  const apiKey = between(body, 'INNERTUBE_API_KEY":"', '"') || between(body, 'innertubeApiKey":"', '"');
  const clientVersion =
    between(body, 'INNERTUBE_CONTEXT_CLIENT_VERSION":"', '"') ||
    between(body, 'innertube_context_client_version":"', '"');
  const context = buildPostContext(clientVersion, options);
  // Return multiple values
  return { json, apiKey, context };
};

const buildPostContext = (exports.buildPostContext = (clientVersion, options = {}) => {
  // Make deep copy and set clientVersion
  const context = clone(DEFAULT_CONTEXT);
  context.client.clientVersion = clientVersion;
  // Add params to context
  if (options.gl) context.client.gl = options.gl;
  if (options.hl) context.client.hl = options.hl;
  if (options.utcOffsetMinutes) context.client.utcOffsetMinutes = options.utcOffsetMinutes;
  if (options.safeSearch) context.user.enableSafetyMode = true;
  return context;
});

// Parsing utility
const parseText = (exports.parseText = txt =>
  typeof txt === 'object' ? txt.simpleText || (Array.isArray(txt.runs) ? txt.runs.map(a => a.text).join('') : '') : '');

exports.parseIntegerFromText = x => (typeof x === 'string' ? Number(x) : Number(parseText(x).replace(/\D+/g, '')));

// Request Utility
exports.doPost = (url, opts, payload) => {
  if (!opts) opts = {};
  const reqOpts = Object.assign({}, opts, { method: 'POST', body: JSON.stringify(payload) });
  return request(url, reqOpts).then(r => r.body.json());
};

// Guarantee that all arguments are valid
exports.checkArgs = (searchString, options = {}) => {
  // Validation
  if (!searchString) {
    throw new Error('search string is mandatory');
  }
  if (typeof searchString !== 'string') {
    throw new Error('search string must be of type string');
  }

  if (typeof options.type !== 'string' || !['video', 'playlist'].includes(options.type)) {
    options.type = 'video';
  }

  // Normalization
  let obj = Object.assign({}, DEFAULT_OPTIONS, options);
  // Other optional params
  if (isNaN(obj.limit) || obj.limit <= 0) obj.limit = DEFAULT_OPTIONS.limit;
  if (typeof obj.safeSearch !== 'boolean') obj.safeSearch = DEFAULT_OPTIONS.safeSearch;
  // Default requestOptions
  if (!options.requestOptions) options.requestOptions = {};
  // Unlink requestOptions
  obj.requestOptions = Object.assign({}, options.requestOptions);
  // Unlink requestOptions#headers
  obj.requestOptions.headers = obj.requestOptions.headers ? clone(obj.requestOptions.headers) : {};
  const cookie = getPropInsensitive(obj.requestOptions.headers, 'cookie');
  if (!cookie) {
    setPropInsensitive(obj.requestOptions.headers, 'cookie', CONSENT_COOKIE);
  } else if (!cookie.includes('SOCS=')) {
    setPropInsensitive(obj.requestOptions.headers, 'cookie', `${cookie}; ${CONSENT_COOKIE}`);
  }
  // Set required parameter: query
  const inputURL = new URL(searchString, BASE_URL);
  if (searchString.startsWith(BASE_URL) && inputURL.pathname === '/results' && inputURL.searchParams.has('sp')) {
    // Watch out for requests with a set filter
    // in such a case searchString would be an url including `sp` & `search_query` querys
    if (!inputURL.searchParams.get('search_query')) {
      throw new Error('filter links have to include a "search_string" query');
    }
    // Object.fromEntries not supported in nodejs < v12
    obj.query = {};
    for (const key of inputURL.searchParams.keys()) {
      obj.query[key] = inputURL.searchParams.get(key);
    }
  } else {
    // If no filter-link default to passing it all as query
    obj.query = { search_query: searchString };
  }
  // Save the search term itself for potential later use
  obj.search = obj.query.search_query;

  // Add additional information
  obj.query = Object.assign({}, DEFAULT_QUERY, obj.query);
  if (options && options.gl) obj.query.gl = options.gl;
  if (options && options.hl) obj.query.hl = options.hl;
  return obj;
};

/**
 * Extract string between another.
 * Property of https://github.com/fent/node-ytdl-core/blob/master/lib/utils.js
 *
 * @param {string} haystack haystack
 * @param {string} left left
 * @param {string} right right
 * @returns {string}
 */
const between = (haystack, left, right) => {
  let pos;
  pos = haystack.indexOf(left);
  if (pos === -1) {
    return '';
  }
  pos += left.length;
  haystack = haystack.slice(pos);
  pos = haystack.indexOf(right);
  if (pos === -1) {
    return '';
  }
  haystack = haystack.slice(0, pos);
  return haystack;
};

/**
 * Extract string between another. (search from right to left)
 * Property of https://github.com/fent/node-ytdl-core/blob/master/lib/utils.js
 *
 * @param {string} haystack haystack
 * @param {string} left left
 * @param {string} right right
 * @returns {string}
 */
exports.betweenFromRight = (haystack, left, right) => {
  let pos;
  pos = haystack.indexOf(right);
  if (pos === -1) {
    return '';
  }
  haystack = haystack.slice(0, pos);
  pos = haystack.lastIndexOf(left);
  if (pos === -1) {
    return '';
  }
  pos += left.length;
  haystack = haystack.slice(pos);
  return haystack;
};

// Sorts Images in descending order & normalizes the url's
exports.prepImg = img => {
  // Resolve url
  img.forEach(x => {
    x.url = x.url ? new URL(x.url, BASE_URL).toString() : null;
  });
  // Sort
  return img.sort((a, b) => b.width - a.width);
};

exports.parseWrapper = primaryContents => {
  let rawItems = [];
  let continuation = null;

  // Older Format
  if (primaryContents.sectionListRenderer) {
    rawItems = primaryContents.sectionListRenderer.contents.find(x => Object.keys(x)[0] === 'itemSectionRenderer')
      .itemSectionRenderer.contents;
    continuation = primaryContents.sectionListRenderer.contents.find(
      x => Object.keys(x)[0] === 'continuationItemRenderer',
    );
    // Newer Format
  } else if (primaryContents.richGridRenderer) {
    rawItems = primaryContents.richGridRenderer.contents
      .filter(x => !Object.prototype.hasOwnProperty.call(x, 'continuationItemRenderer'))
      .map(x => (x.richItemRenderer || x.richSectionRenderer).content);
    continuation = primaryContents.richGridRenderer.contents.find(x =>
      Object.prototype.hasOwnProperty.call(x, 'continuationItemRenderer'),
    );
  }

  return { rawItems, continuation };
};

exports.parsePage2Wrapper = continuationItems => {
  let rawItems = [];
  let continuation = null;

  for (const ci of continuationItems) {
    // Older Format
    if (Object.prototype.hasOwnProperty.call(ci, 'itemSectionRenderer')) {
      rawItems.push(...ci.itemSectionRenderer.contents);
      // Newer Format
    } else if (Object.prototype.hasOwnProperty.call(ci, 'richItemRenderer')) {
      rawItems.push(ci.richItemRenderer.content);
    } else if (Object.prototype.hasOwnProperty.call(ci, 'richSectionRenderer')) {
      rawItems.push(ci.richSectionRenderer.content);
      // Continuation
    } else if (Object.prototype.hasOwnProperty.call(ci, 'continuationItemRenderer')) {
      continuation = ci;
    }
  }

  return { rawItems, continuation };
};

const clone = obj =>
  Object.keys(obj).reduce(
    (v, d) =>
      Object.assign(v, {
        [d]: obj[d].constructor === Object ? clone(obj[d]) : obj[d],
      }),
    {},
  );

const findPropKeyInsensitive = (obj, prop) =>
  Object.keys(obj).find(p => p.toLowerCase() === prop.toLowerCase()) || null;

const getPropInsensitive = (obj, prop) => {
  const key = findPropKeyInsensitive(obj, prop);
  return key && obj[key];
};

const setPropInsensitive = (obj, prop, value) => {
  const key = findPropKeyInsensitive(obj, prop);
  obj[key || prop] = value;
  return key;
};

const dumpDir = PATH.resolve(__dirname, '../dumps/');
if (FS.existsSync(dumpDir)) FS.rmdirSync(dumpDir, { recursive: true });

exports.logger = content => {
  const file = PATH.resolve(dumpDir, `${Date.now()}-${Math.random().toString(36).slice(3)}.txt`);
  const cfg = PATH.resolve(__dirname, '../package.json');
  const bugsRef = require(cfg).bugs.url;

  if (!FS.existsSync(dumpDir)) FS.mkdirSync(dumpDir);
  FS.writeFileSync(file, JSON.stringify(content));
  console.error('*'.repeat(200));
  console.error('Unsupported YouTube Search response.');
  console.error(`Please post the the file "${file}" to ${bugsRef} or DisTube support server. Thanks!`);
  console.error('*'.repeat(200));
  return null;
};

const pkg = require('../package.json');
const UPDATE_INTERVAL = 1000 * 60 * 60 * 12;
let updateWarnTimes = 0;
let lastUpdateCheck = 0;
exports.checkForUpdates = async () => {
  if (process.env.YTSR_NO_UPDATE || Date.now() - lastUpdateCheck < UPDATE_INTERVAL) return;

  try {
    lastUpdateCheck = Date.now();
    const res = await request('https://api.github.com/repos/distubejs/ytsr/contents/package.json', {
      headers: { 'User-Agent': 'Chromium";v="112", "Microsoft Edge";v="112", "Not:A-Brand";v="99' },
    });
    if (res.statusCode !== 200) throw new Error(`Status code: ${res.statusCode}`);
    const data = await res.body.json();
    const buf = Buffer.from(data.content, data.encoding);
    const pkgFile = JSON.parse(buf.toString('ascii'));
    if (pkgFile.version !== pkg.version && updateWarnTimes++ < 5) {
      console.warn(
        '\x1b[33mWARNING:\x1B[0m @distube/ytsr is out of date! Update with "npm install @distube/ytsr@latest".',
      );
    }
  } catch (err) {
    console.warn('Error checking for updates:', err.message);
    console.warn('You can disable this check by setting the `YTSR_NO_UPDATE` env variable.');
  }
};

exports.errorToObject = err => {
  const obj = {};
  Object.getOwnPropertyNames(err).forEach(key => {
    obj[key] = err[key];
  });
  return obj;
};
