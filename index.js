module.exports.SlowPromise = function (resolver) {
    const p = new Promise(resolver);
    return {
        then: f => p.then(f)
    };
};
