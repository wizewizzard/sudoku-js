import FixedSizeQueue from "../../main/utils/FixedSizeQueue.js";
import chai from 'chai';

describe("Fixed size queue", function(){ 
    describe("Adding elements", function() {
        it("Empty queue provides empty array", function () {
            const queue = new FixedSizeQueue(5);
            chai.expect([...queue]).to.eql([]);
            chai.expect(queue.length).to.equal(0);
        });
        it("Queue with single value provides single valued array", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(1);
            chai.expect([...queue]).to.eql([1]);
            chai.expect(queue.length).to.equal(1);
        });
        it("Supports adding null values", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(1);
            queue.put(null);
            queue.put(null);
            queue.put(null);
            queue.put(null);
            chai.expect([...queue]).to.eql([1, null, null, null, null]);
            chai.expect(queue.length).to.equal(5);
        });
        it("Supports vararg as input", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(1, 2, 3, 4, 5);
            chai.expect([...queue]).to.eql([1, 2, 3, 4, 5]);
            chai.expect(queue.length).to.equal(5);
        });
        it("Should add repeated elements", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(2, 2, 2, 3, 2);
            chai.expect([...queue]).to.eql([2, 2, 2, 3, 2]);
            chai.expect(queue.length).to.equal(5);
        });
        it("Should maintain correct order - FIFO", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(3, 1, 3, 0, 5, 4);
            chai.expect([...queue]).to.eql([1, 3, 0, 5, 4]);
        });
    });
    describe("Popping elements", function() {
        it("Empty queue should pop undefined element", function () {
            const queue = new FixedSizeQueue(5);
            chai.expect(queue.length).to.equal(0);
            chai.expect(queue.pop()).to.be.undefined;
        });
        it("Order of popped elements should be the same as the order they were added", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(3, 1, 3, 0, 5, 4);
            chai.expect(queue.length).to.equal(5);
            chai.expect(queue.pop()).to.equal(1);
            chai.expect(queue.pop()).to.equal(3);
            chai.expect(queue.pop()).to.equal(0);
            chai.expect(queue.pop()).to.equal(5);
            chai.expect(queue.pop()).to.equal(4);
            chai.expect(queue.length).to.equal(0);
        });
    });
    describe("Combining popping and adding", function() {
        it("Should correctly override old values", function () {
            const queue = new FixedSizeQueue(5);
            queue.put(3, 1, 3, 0, 5, 4, 9, 8);
            chai.expect(queue.length).to.equal(5);
            chai.expect([...queue]).to.eql([0, 5, 4, 9, 8]);
            queue.pop();
            queue.pop();
            queue.pop();
            queue.pop();
            queue.pop();
            queue.put(1, 2, 3);
            chai.expect([...queue]).to.eql([1, 2, 3]);
        })
    });
    describe("Testing one element sized queue", function() {
        it("Should add and pop elements into / from one sized element queue", function () {
            const queue = new FixedSizeQueue(1);
            queue.put(3);
            chai.expect(queue.length).to.equal(1);
            chai.expect(queue.pop()).to.equal(3);
            chai.expect(queue.length).to.equal(0);
            queue.put(5);
            chai.expect(queue.length).to.equal(1);
            chai.expect(queue.pop()).to.equal(5);
            chai.expect(queue.length).to.equal(0);
            queue.put(8);
            chai.expect([...queue]).to.eql([8]);
        });
        it("After adding multiple values only the last one should remain ", function () {
            const queue = new FixedSizeQueue(1);
            queue.put(3, 7, 6);
            chai.expect(queue.length).to.equal(1);
            chai.expect([...queue]).to.eql([6]);
            chai.expect(queue.pop()).to.equal(6);
            chai.expect(queue.length).to.equal(0);
        });
    });
});
