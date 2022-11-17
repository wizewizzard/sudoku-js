import { hasWinCondition } from "./fieldMonitoring.js";

class EventEmitter{
    constructor(){
        this.listeners = new Map();
    }
    emit(event){
        if(this.listeners.has(event.getName())){
            for(const fn of this.listeners.get(event.getName()) ){
                fn(event);
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
        if(hasWinCondition(field.getValuesFlat())){
            emitter.emit({getName: () => 'winCondition'})
        }
    }
}

function winConditionSubscriber(field, emitter){
    return function(event){
        console.log('You won!');
    }
}

export {EventEmitter, winCheckSubscriber, winConditionSubscriber};