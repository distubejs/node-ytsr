const buildUrl = (baseUrl, queryObject) => {
  const url = new URL(baseUrl)
  const params = new URLSearchParams(queryObject)
  const mergedQueryParams = new URLSearchParams([...url.searchParams, ...params])
  url.search = mergedQueryParams.toString()
  return url.toString()
}

exports.get = async (url, opts) => {
  if (!opts) opts = {};

  const formattedUrl = buildUrl(url, opts?.query)
  const response = await fetch(formattedUrl, opts);
  
  if(!response.ok){
    throw response
  }

  return response;
};

exports.post = async (url, opts, payload) => {
  if (!opts) opts = {};
  const reqOpts = Object.assign({}, opts, { method: 'POST', body: JSON.stringify(payload) });
  const response = await fetch(url, reqOpts);
  
  if(!response.ok){
    throw response
  }

  return response;
};