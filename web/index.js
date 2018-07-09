/**
 * Static website, for now.
 *
 *  1. render json + hbs => html
 *  2. serve assets
 */
require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3000;
const debug = require('debug')('webserver');

(() => {
    try {
        debug('Stand up, webserver');
        http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('Hello World!'); //write a response to the client
            res.end(); //end the response
        }).listen(port);
        debug(`Ready and listening on http://localhost:${port}`);
    } catch (exception) {
        debug('Exception', exception);
    }
})();
