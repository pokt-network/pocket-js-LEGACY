import { expect } from 'chai';
import { Queue } from '../src/utils/structure/queue'

describe('Queue Tests', () => {
    it('should create an empty queue', () => {
      let queue = new Queue<number>();
      expect(queue.length).to.equal(0);
      expect(queue.front).to.be.null;
    });
  
    it('should create a queue with a single value', () => {
      let queue = new Queue<number>(4);
      expect(queue.length).to.equal(1);
      expect(queue.front).to.equal(4);
    });
  
    it('should create a Queue with mutiple initial values', () => {
      let values: number[] = [4, 5, 6]
      let queue = new Queue<number>(...values);
      expect(queue.length).to.equal(3);
      expect(queue.front).to.equal(4);
    })

    it('should enqueue a value to the back of the queue', () => {
      let values: number[] = [4, 5, 6]
      let queue = new Queue<number>(...values);
      expect(queue.length).to.equal(3);
      expect(queue.front).to.equal(4);
      queue.enqueue(7);
      expect(queue.length).to.equal(4);
      expect(queue.front).to.equal(4);
      queue.dequeue();
      queue.dequeue();
      queue.dequeue();
      expect(queue.length).to.equal(1);
      expect(queue.front).to.equal(7);
    });
  
    it('should enqueue a value to the back of an empty queue', () => {
      let queue = new Queue<number>();
      expect(queue.length).to.equal(0);
      expect(queue.front).to.be.null;
      queue.enqueue(1);
      expect(queue.length).to.equal(1);
      expect(queue.front).to.equal(1);
    });
  
    it('should dequeue a value from the front of the queue', () => {
      let values: number[] = [4, 5, 6]
      let queue = new Queue<number>(...values);
      expect(queue.length).to.equal(3);
      expect(queue.front).to.equal(4);
      let val = queue.dequeue();
      expect(queue.length).to.equal(2);
      expect(queue.front).to.equal(5);
      expect(val).to.equal(4);
    });
  
    it('should handle dequeueing a value from an empty queue', () => {
      let queue = new Queue<number>();
      expect(queue.length).to.equal(0);
      expect(queue.front).to.be.null;
      expect(queue.tail).to.be.null;
      let val = queue.dequeue()
      expect(queue.length).to.equal(0);
      expect(queue.front).to.be.null;
      expect(val).to.be.undefined;
    });
  
    it('should convert the queue to an array', () => {
      let values: number[] = [4, 5, 6]
      let queue = new Queue<number>(...values);
      expect(queue.length).to.equal(3);
      expect(queue.front).to.equal(4);
      let result = queue.toArray()
      expect(queue.length).to.equal(3);
      expect(queue.front).to.equal(4);
      expect(result).to.deep.equal(values);
    });
  });