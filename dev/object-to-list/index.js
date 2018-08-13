const debug = require('debug')('isymbio:dev:object-to-list');
const save = require('../lib/save');

(async () => {
    try {
        await require('./object-to-list')(
            __dirname + '/../tmp/isymbio-pages.json',
            __dirname + '/../tmp/isymbio-pages-list.json',
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
