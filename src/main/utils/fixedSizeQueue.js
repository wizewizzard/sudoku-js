function FixedSizeQueue (cap) {
    if( !cap || cap <= 0 )
        throw new Error("Capacity is required and must be greater than 0");
    this.storage = [];
    this.length = 0;
    this.capacity = cap;
    let startIndex, endIndex;

    this.put = function (...items) {

    }

    this.pop = function () {
        if (length > 0) {

        }
    }

    this[Symbol.iterator] = function () {
        return {
            next() {
                return {
                    done: true
                }
            }
        }
    }

}

export default FixedSizeQueue;