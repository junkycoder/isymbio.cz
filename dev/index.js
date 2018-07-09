/**
 * Static website generator.
 *
 *  1. generate json + hbs => html
 *  2. serve assets
 */
require('dotenv').config();

const http = require('http');
const debug = require('debug')('dev');

(() => {
    debug('Starting generator');
    require('./generator')();
})();

(() => {
    debug('Starting app');
    require('../app')();
})();
