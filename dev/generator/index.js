const debug = require('debug')('isymbio:dev:generator');
const save = require('../lib/save');

(async () => {
    try {
        await require('./generator')(
            __dirname + '/../tmp/app',
            async (data, markdown) => {
                const header = [
                    '---',
                    'title: ' + data.title,
                    '---',
                    null,
                ].join('\n');
                await save(
                    __dirname + `/../app/markdown/${data.type}/${data.name}.md`,
                    header + markdown,
                );
            },
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
