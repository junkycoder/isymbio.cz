/**
 * Static website, for now.
 *
 *  1. render json + hbs => html
 *  2. serve assets
 */

const http = require('http');
const port = process.env.PORT || 3000;

//create a server object:
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(port);
