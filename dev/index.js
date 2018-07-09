/**
 * Static website generator.
 *
 *  1. generate json + hbs => html
 *  2. serve assets
 */
require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3000;
const debug = require('debug')('dev');

(() => {
    debug('Starting app');
    require('../app')();
})();
