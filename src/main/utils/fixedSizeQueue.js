function incrementInRespectOfCapacity(initialValue, capacity) {
    return (initialValue + 1) % capacity
}

function FixedSizeQueue (cap) {
    if( !cap || cap <= 0 )
        throw new Error("Capacity is required and must be greater than 0");
    this.storage = [];
    this.length = 0;
    this.capacity = cap;
    this.startIndex = this.endIndex = 0;
}

FixedSizeQueue.prototype.put = function (...items) {
    items.forEach(item => {
        console.debug('Adding ', item);
        if(this.length === 0) {
            this.storage[this.startIndex] = item;
            console.debug('Length is 0. Adding at the start ', item)
        }
        else{
            this.endIndex = (this.endIndex + 1) % this.capacity;
            this.storage[this.endIndex] = item;
            if(this.endIndex === this.startIndex) {
                this.startIndex = (this.startIndex + 1) % this.capacity;
            }
        }
        this.length++;
        this.length = Math.min(this.length, this.capacity);
    });
}

FixedSizeQueue.prototype.pop = function () {
    if (this.length > 0) {
        const item = this.storage[this.startIndex];
        this.startIndex = (this.startIndex + 1) % this.capacity;
        this.length --;
        return item;
    }
}

FixedSizeQueue.prototype[Symbol.iterator] = function () {
    let index = this.startIndex;
    let count = 0;
    console.debug(this.storage)
    return {
        next: () => {
            if( count >= this.length) {
                return { done: true };
            }
            else{
                const item = this.storage[index];
                index = (index + 1) % this.capacity;
                count ++;
                return {done: false, value: item}
            }
        }
    }
}

export default FixedSizeQueue;