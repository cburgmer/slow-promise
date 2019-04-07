const delayInMs = 1000;
const delay = value => new Promise(f => setTimeout(() => f(value), delayInMs));

const wrapPromise = promise => ({
    then: (f, r) => wrapPromise(promise.finally(delay).then(f, r))
});

const SlowPromise = function(resolver) {
    return wrapPromise(new Promise(resolver));
};

SlowPromise.resolve = v => wrapPromise(Promise.resolve(v));
SlowPromise.reject = e => wrapPromise(Promise.reject(e));

module.exports.SlowPromise = SlowPromise;
