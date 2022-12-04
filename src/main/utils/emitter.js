function EventEmitter(){
    this.listeners = new Map();
}

EventEmitter.prototype.emit = function (eventName, data) {
    if (this.listeners.has(eventName)) {
        for (const fn of this.listeners.get(eventName)) {
            fn(eventName, data);
        }
    }
} 

EventEmitter.prototype.subscribe = function (eventName, fn) {
    if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(fn);
} 

EventEmitter.prototype.unSubscribe = function (eventName, fn) {
    if (this.listeners.has(eventName)) {
        const fns = this.listeners.get(eventName);
        fns.delete(fn);
    }
}

EventEmitter.prototype.clear = function() {
    this.listeners = new Map();
}

export default EventEmitter;