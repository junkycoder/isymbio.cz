const debug = require('debug')('isymbio:dev:generator');
const save = require('../../lib/save');

const tmp_dir = __dirname + '/../../tmp';
const app_dir = __dirname + '/../../app';

(async () => {
    try {
        await require('./generator')(
            tmp_dir + '/app',
            async (data, markdown) => {
                const header = [
                    '---',
                    'title: ' + data.title,
                    '---',
                    null,
                ].join('\n');
                await save(
                    `${app_dir}/markdown/${data.type}/${data.name}.md`,
                    header + markdown,
                );
            },
        );
    } catch (error) {
        debug('Error:\n', error);
    }
})();
