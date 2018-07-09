const debug = require('debug')('dev:generator');
const glob = require('glob');
const { getDataOfTemplate } = require('../lib/generator');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = () => {
    debug(`Collecting source files...`);

    glob.sync('./app/*.hbs').forEach(filename => {
        debug(`Found template file ${filename}`);

        const template = hbs.compile(fs.readFileSync(filename, 'utf8'));
        const data = getDataOfTemplate(filename);
        const htmlFileName = filename
            .replace('app', 'web')
            .replace('.hbs', '.html');

        try {
            debug(`Create html file ${htmlFileName}`);
            fs.writeFileSync(htmlFileName, template(data), { flag: 'w' });
        } catch (error) {
            debug(`Error while creating ${htmlFileName}`, error);
        }
    });
};
