const delayInMs = 1000;
const delay = () => new Promise(f => setTimeout(f, delayInMs));

const SlowPromise = function(resolver) {
    const p = new Promise(resolver);
    return p.then(delay);
};

SlowPromise.resolve = () => new SlowPromise(f => f());

module.exports.SlowPromise = SlowPromise;
