const { SlowPromise } = require('./index');

describe('slow-promise', () => {
    it('calls a callback when already fulfilled', done => {
        const p = new SlowPromise(f => f());
        p.then(done);
    });

    it('does not call callback if not fulfilled', () => {
        const p = new SlowPromise(() => {});
        const spy = jasmine.createSpy();
        p.then(spy);
        expect(spy).not.toHaveBeenCalled();
    });
});
