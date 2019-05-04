module.exports = function promisify(nodeFunction) {
    function promisified(...args) {
        return new Promise((resolve, reject) => {
            function callback(err, ...result) {
                if (err) return reject(err);
                if (result.length === 1) return resolve(result[0]);
                return resolve(result);
            }
            nodeFunction.call(null, ...args, callback);
        });
    }
    return promisified;
};
