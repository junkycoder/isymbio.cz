/**
 * Static website, for now.
 *
 *  1. serve documents
 */
require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3000;
const debug = require('debug')('app');
const path = require('path');
const fs = require('fs');

module.exports = () => {
    try {
        debug('Stand up, webserver');
        http.createServer((request, response) => {
            let filePath =
                request.url === '/'
                    ? './web/index.html'
                    : `./web${request.url}`;
            debug(`New request ${filePath}`);

            const extname = path.extname(filePath);

            let contentType = 'text/html';
            switch (extname) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
                case '.wav':
                    contentType = 'audio/wav';
                    break;
            }

            fs.readFile(filePath, function(error, content) {
                if (error) {
                    if (error.code == 'ENOENT') {
                        debug(`Not found`);
                        fs.readFile('./web/404.html', function(error, content) {
                            debug(`App response ./web/404.html`);
                            response.writeHead(200, {
                                'Content-Type': contentType,
                            });
                            response.end(content, 'utf-8');
                        });
                    } else {
                        debug('App error 500');
                        response.writeHead(500);
                        response.end(
                            'Sorry, check with the site admin for error: ' +
                                error.code +
                                ' ..\n',
                        );
                        response.end();
                    }
                    return;
                }

                debug(`App response ${filePath}`);
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            });
        }).listen(port);
        debug(`Ready and listening on http://localhost:${port}`);
    } catch (exception) {
        debug('Exception', exception);
    }
};
