const { SlowPromise } = require('./index');

describe('slow-promise', () => {
    it('does something', done => {
        const p = new SlowPromise(f => f());
        p.then(done);
    });
});
