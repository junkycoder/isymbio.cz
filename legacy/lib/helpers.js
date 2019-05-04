// Usage : compose functions right to left
// compose(minus8, add10, multiply10)(4) === 42
//
// The resulting function can accept as many arguments as the first function does
// compose(add2, multiply)(4, 10) === 42
// source: https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
module.exports.compose = (...fns) =>
    fns.reduce((f, g) => (...args) => f(g(...args)));
