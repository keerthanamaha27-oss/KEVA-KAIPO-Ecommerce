
/**
 * KEVA KAIPO - Local Node.js Server
 * Static file server with safe path handling and image support.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const cliPort = process.argv[2] && !isNaN(parseInt(process.argv[2]))
  ? parseInt(process.argv[2])
  : null;

const PORT = cliPort || (process.env.PORT ? parseInt(process.env.PORT) : 8081);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url.split('?')[0] === '/api/send-confirmation-email') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        const orderData = JSON.parse(body);

        console.log(
          `[EMAIL DISPATCH] Order #${orderData.orderId} to ${orderData.customer?.email}`
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Confirmation email simulated for ${orderData.customer?.email}`,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: error.message
        }));
      }
    });

    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405);
    return res.end('Method Not Allowed');
  }

  let requestPath;

  try {
    requestPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    return res.end('Invalid URL');
  }

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  const relativePath = requestPath.replace(/^[/\\]+/, '');
  const filePath = path.resolve(PUBLIC_DIR, relativePath);

  if (
    filePath !== PUBLIC_DIR &&
    !filePath.startsWith(PUBLIC_DIR + path.sep)
  ) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  console.log(`[REQUEST] ${requestPath}`);
  console.log(`[FILE] ${filePath}`);

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      console.log(`[NOT FOUND] ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 Not Found: ' + requestPath);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('error', error => {
      console.error('File read error:', error);
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
  });
});

server.listen(PORT, () => {
  console.log('\n==========================================');
  console.log('KEVA KAIPO - Store Server Running');
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`Serving files from: ${PUBLIC_DIR}`);
  console.log('==========================================\n');
});

server.on('error', error => {
  console.error('Server error:', error);
});
