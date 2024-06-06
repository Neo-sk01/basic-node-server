const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
};

// Helper function to serve a file
const serveFile = (res, filePath, contentType, responseCode = 200) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile('./404.html', (err404, data404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(data404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    const parsedUrl = url.parse(req.url);
    let pathname = `.${parsedUrl.pathname}`;

    // Route handling
    if (pathname === './') {
        serveFile(res, './index.html', 'text/html');
    } else if (pathname === './about') {
        serveFile(res, './about.html', 'text/html');
    } else {
        // Handle static files with MIME types
        const extname = String(path.extname(pathname)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        serveFile(res, pathname, contentType);
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
