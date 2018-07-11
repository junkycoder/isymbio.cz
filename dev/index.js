require('dotenv').config();

const debug = require('debug')('dev');

(async () => {
    await require('./collector')('http://isymbio.cz/', './tmp/raw/index');
})();
