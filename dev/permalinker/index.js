const debug = require('debug')('isymbio:dev:generator');
const save = require('../lib/save');

(async () => {
    const pages = require('../tmp/isymbio-clean-pages-list.json');

    try {
        await require('./permalinker')(
            pages,
            __dirname + '/../tmp/app',
            data => {
                console.log(data.content);
            },
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
