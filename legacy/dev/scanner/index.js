const debug = require('debug')('isymbio:dev:scanner');
const save = require('../../lib/save');

const TARGET_FILE = __dirname + '/../../tmp/isymbio-links.json';

(async () => {
    let initialState;

    try {
        initialState = require(TARGET_FILE);
    } catch (error) {
        debug('No previus temporary file found');
    }

    try {
        await require('./scanner')(
            'http://isymbio.cz/',
            initialState,
            {
                shouldFollow(link) {
                    return (
                        link.includes('symbio-ops.cz') ||
                        link.includes('isymbio.cz')
                    );
                },
            },
            async data => {
                await save(TARGET_FILE, data);
            },
        );
    } catch (error) {
        debug('Error in scanner', error);
    }
})();
