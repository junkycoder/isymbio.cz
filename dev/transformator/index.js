const debug = require('debug')('isymbio:dev:transformator');
const save = require('../lib/save');

(async () => {
    const pages = require('../tmp/isymbio-clean-pages-list.json').sort(
        (a, b) => a.score < b.score,
    );

    try {
        await require('./transformator')(pages, async (page, data) => {
            await save(
                __dirname + `/../tmp/app/${data.type}/${data.name}.json`,
                data,
            );
        });
    } catch (error) {
        debug('Error:\n', error);
    }
})();
