/**
 *
 * @param {string} url
 * @source https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e
 */
const hashURLAsID = url =>
    require('crypto')
        .createHash('sha1')
        .update(url)
        .digest('base64');

module.exports = {
    hashURLAsID,
};
