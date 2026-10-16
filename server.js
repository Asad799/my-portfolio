const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 3000;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const send = (response, status, contentType, body) => {
  response.writeHead(status, { 'Content-Type': contentType });
  response.end(body);
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
  const filePath = path.resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    send(response, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(response, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(response);
  });
});

server.listen(port, () => {
  console.log(`Portfolio running at http://localhost:${port}`);
});
