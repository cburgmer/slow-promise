const { SlowPromise } = require("./index");

describe("slow-promise", () => {
    let spy;

    beforeEach(() => {
        spy = jasmine.createSpy();
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    const processNextPromiseChain = async () =>
        new Promise(f => setImmediate(f));

    it("does not fulfill if timeout hasn't occurred yet", async () => {
        const p = new SlowPromise(f => f());
        p.then(spy);

        await processNextPromiseChain();
        jasmine.clock().tick(999);
        await processNextPromiseChain();
        expect(spy).not.toHaveBeenCalled();
    });

    it("calls a callback after timeout has occurred", async () => {
        const p = new SlowPromise(f => f());
        p.then(spy);

        await processNextPromiseChain();
        jasmine.clock().tick(1000);
        await processNextPromiseChain();
        expect(spy).toHaveBeenCalled();
    });

    it("does not call callback if not fulfilled", async () => {
        const p = new SlowPromise(() => {});
        p.then(spy);

        await processNextPromiseChain();
        jasmine.clock().tick(1000);
        await processNextPromiseChain();
        expect(spy).not.toHaveBeenCalled();
    });

    describe(".resolve()", () => {
        it("does not fulfill if timeout hasn't occurred yet", async () => {
            const p = SlowPromise.resolve();
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(999);
            await processNextPromiseChain();
            expect(spy).not.toHaveBeenCalled();
        });

        it("calls a callback after timeout has occurred", async () => {
            const p = SlowPromise.resolve();
            p.then(spy);

            await processNextPromiseChain();
            jasmine.clock().tick(1000);
            await processNextPromiseChain();
            expect(spy).toHaveBeenCalled();
        });
    });
});
