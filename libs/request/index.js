import request from 'request-promise';

export default async options => {
  options.method = options.method || 'GET';

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'max-age=0',
    'x-forwarded-for': '127.0.0.1'
  };

  if (options.headers) {
    for (const key of Object.keys(options.headers)) {
      headers[key] = options.headers[key];
    }
  }

  const settings = {
    ...options,
    proxy: options.proxy,
    uri: options.uri,
    method: options.method,
    json: options.json,
    followAllRedirects: options.followAllRedirects,
    headers,
    simple: false,
    resolveWithFullResponse: true
  };

  if (options.body) settings.body = options.body;

  if (options.form) settings.form = options.form;

  return await request.defaults({ jar: true })(settings);
};
