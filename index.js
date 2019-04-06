const delayInMs = 1000;
const delay = value => new Promise(f => setTimeout(() => f(value), delayInMs));

const SlowPromise = function(resolver) {
    const p = new Promise(resolver);
    const delayedResult = p.then(delay);
    return {
        then: f => SlowPromise.resolve(delayedResult.then(f))
    };
};

SlowPromise.resolve = v => Promise.resolve(v).then(delay);

module.exports.SlowPromise = SlowPromise;
