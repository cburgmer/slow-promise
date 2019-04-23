const NativePromise = Promise; // this will allow us to install SlowPromise in place of the native Promise implementation
let nativeFetch = window.fetch;
module.exports.mockFetch = (mockFetch) => nativeFetch = mockFetch;

let delayInMs = 1000;
module.exports.setDelay = delay => (delayInMs = delay);
const delay = () => new NativePromise(f => setTimeout(f, delayInMs));

const wrapPromise = promise => ({
    then: (f, r) => wrapPromise(promise.finally(delay).then(f, r)),
    catch: r => wrapPromise(promise.finally(delay).catch(r)),
    finally: c => wrapPromise(promise.finally(delay).finally(c))
});

const SlowPromise = function(resolver) {
    return wrapPromise(new NativePromise(resolver));
};

SlowPromise.resolve = v => wrapPromise(NativePromise.resolve(v));
SlowPromise.reject = e => wrapPromise(NativePromise.reject(e));
SlowPromise.all = l => wrapPromise(NativePromise.all(l));
SlowPromise.race = l => wrapPromise(NativePromise.race(l));

const slowFetch = (...args) => wrapPromise(nativeFetch.apply(window, args));

module.exports.SlowPromise = SlowPromise;
module.exports.slowFetch = slowFetch;
