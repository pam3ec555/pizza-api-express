const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('../config');
const routes = require('./routes');
const { jsonParse } = require('./utils');
const { ContentType } = require('./utils/enums');

const server = {};

/**
 * @param {string} contentType
 * @param {*} payload
 * @return {*}
 */
const getStringPayload = (contentType, payload) => {
  switch (contentType) {
    case 'json':
      payload = typeof payload === 'object' ? payload : {};

      return JSON.stringify(payload);
    case 'html':
      payload = typeof payload === 'string' ? payload : '';

      return payload;
    default:
      payload = typeof payload !== 'undefined' ? payload : '';

      return payload;
  }
};

/**
 * @param {ServerResponse} res
 * @return {function({ statusCode: number, data: Object, contentType: string })}
 */
const routeCallback = (res) => ({
  statusCode,
  data,
  contentType,
}) => {
  if (typeof statusCode !== 'number') {
    statusCode = 200;
  }
  if (typeof contentType !== 'string') {
    contentType = 'json';
  }

  res.setHeader('Content-Type', ContentType[contentType] || 'text/plain');
  res.writeHead(statusCode);
  res.end(getStringPayload(contentType, data));
};

server.init = () => {
  const _server = http.createServer((req, res) => {
    const decoder = new StringDecoder('utf8');
    let buffer = '';

    req.on('data', (data) => {
      buffer += decoder.write(data);
    });

    req.on('end', () => {
      buffer += decoder.end();

      const parsedUrl = url.parse(req.url, true);
      const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '') || 'index';

      let routeHandler;
      if (trimmedPath.startsWith('public/')) {
        routeHandler = routes.public;
      } else if (typeof routes[trimmedPath] !== 'undefined') {
        routeHandler = routes[trimmedPath];
      } else {
        routeHandler = routes.notFound;
      }

      const { headers = {}, method } = req;

      routeHandler(
        {
          headers,
          method: method.toLowerCase(),
          query: parsedUrl.query,
          payload: jsonParse(buffer),
          trimmedPath,
        },
        routeCallback(res),
      );
    });
  });

  _server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}!`);
  });
};

module.exports = server;
