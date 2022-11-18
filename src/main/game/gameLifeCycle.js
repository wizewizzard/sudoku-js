import { hasWinCondition, allCellsFilled } from "./fieldMonitoring.js";

const events = Object.freeze({
    GAME_START: 'gameStart',
    GAME_RESTART: 'gameRestart',
    VALUE_SET: 'valueSet',
    CELL_SELECTED: 'cellSelected',
    FIELD_FILLED: 'fieldIsFull',
    WIN_CONDITION: 'winCondition'
});

class EventEmitter{
    constructor(){
        this.listeners = new Map();
    }
    emit(data){
        if(this.listeners.has(data.event)){
            for(const fn of this.listeners.get(data.event) ){
                fn(data);
            }
        }
    }
    subscribe(eventName, fn){
        if(!this.listeners.has(eventName)){
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(fn);
    }
    unSubscribe(eventName, fn){
        if(this.listeners.has(eventName)){
            const fns = this.listeners.get(eventName);
            const index = fns.indexOf(fn);
            if(index >= 0)
                fns.splice(index, 1);
        }
    }
}

function winCheckSubscriber(field, emitter){
    return function(event){
        if(allCellsFilled(field.getValuesFlat()) && hasWinCondition(field.getValuesFlat())){
            emitter.emit({event: events.WIN_CONDITION})
        }
    }
}

function winConditionSubscriber(field, selector, emitter){
    
    return function(event){
        selector.disable();
    }
}

export {EventEmitter, events, winCheckSubscriber, winConditionSubscriber};