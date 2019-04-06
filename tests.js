const { SlowPromise } = require('./index');

describe('slow-promise', () => {
    let spy;

    beforeEach(() => {
        spy = jasmine.createSpy();
    });

    it('does not fulfill if timeout hasn\'t occurred yet', done => {
        const p = new SlowPromise(f => f());
        p.then(spy);

        setTimeout(() => {
            expect(spy).not.toHaveBeenCalled();
            done();
        }, 900);
    });

    it('calls a callback after timeout has occurred', done => {
        const p = new SlowPromise(f => f());
        p.then(spy);

        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 1100);
    });

    it('does not call callback if not fulfilled', done => {
        const p = new SlowPromise(() => {});
        p.then(spy);
        setTimeout(() => {
            expect(spy).not.toHaveBeenCalled();
            done();
        }, 1100);
    });
});
