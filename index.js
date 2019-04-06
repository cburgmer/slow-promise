const delayInMs = 1000;
const delay = value => new Promise(f => setTimeout(() => f(value), delayInMs));

const wrapThenable = thenable => ({
    then: f => SlowPromise.resolve(thenable.then(f))
});

const SlowPromise = function(resolver) {
    const p = new Promise(resolver);
    return wrapThenable(p.then(delay));
};

SlowPromise.resolve = v => wrapThenable(Promise.resolve(v).then(delay));

module.exports.SlowPromise = SlowPromise;
