const delayInMs = 1000;
const delay = value => new Promise(f => setTimeout(() => f(value), delayInMs));

const wrapPromise = promise => ({
    then: f => wrapPromise(promise.then(delay).then(f))
});

const SlowPromise = function(resolver) {
    return wrapPromise(new Promise(resolver));
};

SlowPromise.resolve = v => wrapPromise(Promise.resolve(v));

module.exports.SlowPromise = SlowPromise;
