import FixedSizeQueue from "../utils/FixedSizeQueue.js";
import emitter from "../event/emitter.js";
import { events } from "../event/eventsList.js";

function GameHistory () {
    this.queue = new FixedSizeQueue(10);

    this.load = function () {
        if(localStorage.getItem('gameHistory')) {
            console.debug('Putting saved in localStorage history into the queue');
            try{
                this.queue.put(...JSON.parse(localStorage.getItem('gameHistory')));
                emitter.emit(events.HISTORY_UPDATED, {history: [...this.queue]});
            }
            catch(e){
                console.error('Error reading gameHistory from localstorage', e)
            }
        }
    }

    this.persist = function () {
        const history = [...this.queue];
        if(history && history.length > 0) {
            console.debug('Saving history to localStorage');
            localStorage.setItem('gameHistory', JSON.stringify(history));
        }
    }

    this.addRecord = function (record) {
        this.queue.put(record);
        emitter.emit(events.HISTORY_UPDATED, {history: [...this.queue]});
    }
}

export default GameHistory;