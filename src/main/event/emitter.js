export default (function () {
    function EventEmitter() {
        this.listeners = new Map();

        this.emit = function (eventName, data) {
            if (this.listeners.has(eventName)) {
                console.debug(`Emitting event ${eventName} to ${this.listeners.get(eventName).size} listeners`);
                for (const fn of this.listeners.get(eventName)) {
                    fn(eventName, data);
                }
            }
            else{
                console.debug(`Event ${eventName} ignored due to the absence of listeners`);
            }
        }

        this.subscribe = function (eventName, fn) {
            if (!this.listeners.has(eventName)) {
                this.listeners.set(eventName, new Set());
            }
            this.listeners.get(eventName).add(fn);
        }

        this.unSubscribe = function (eventName, fn) {
            if (this.listeners.has(eventName)) {
                const fns = this.listeners.get(eventName);
                fns.delete(fn);
            }
        }

        this.clear = function () {
            this.listeners = new Map();
        }
    }

    return new EventEmitter();
})();