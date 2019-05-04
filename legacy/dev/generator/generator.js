const debug = require('debug')('isymbio:dev:generator');
const glob = require('glob');

module.exports = async function(source_dir, handler) {
    const service = new (require('turndown'))({
        headingStyle: 'atx',
    });

    glob(`${source_dir}/**/*.json`, {}, async (error, files) => {
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const data = require(file);
            const markdown = service.turndown(data.content);

            handler(data, markdown);
        }
    });
};
