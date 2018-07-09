const tap = require('tap');
const { getDataOfTemplate } = require('./generator');

tap.test('Always returns object', test => {
    test.ok(getDataOfTemplate());
    test.ok(getDataOfTemplate('./'));
    test.ok(getDataOfTemplate(null));
    test.end();
});
