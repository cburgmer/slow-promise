const delayInMs = 1000;
const delay = () => new Promise(f => setTimeout(f, delayInMs));

module.exports.SlowPromise = function(resolver) {
    const p = new Promise(resolver);
    return {
        then: f => p.then(delay).then(f)
    };
};
