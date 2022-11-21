import { hasWinCondition, allCellsFilled } from "./fieldMonitoring.js";
import Generator from '../generator/generator.js'

const events = Object.freeze({
    GAME_START: 'gameStart',
    GAME_RESTART: 'gameRestart',
    VALUE_SET: 'valueSet',
    CELL_SELECTED: 'cellSelected',
    FIELD_UPDATED: 'fieldUpdated',
    FIELD_FILLED: 'fieldIsFull',
    WIN_CONDITION: 'winCondition'
});

class EventEmitter{
    constructor(){
        this.listeners = new Map();
    }
    emit(event){
        if(this.listeners.has(event.eventName)){
            for(const fn of this.listeners.get(event.eventName) ){
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

// function cellSelectionSubscriber(emitter, selector){
//     return function({payload: {index, supposed}}){
//         selector.select(index, supposed);
//     }
// }

function valueSetSubscriber(emitter, field){
    return function({payload: {index, value, supposed}}){
        console.trace('ValueSetSubscriber subscriber triggered');
        field.setValue(index, value, supposed);
        emitter.emit({eventName: events.FIELD_UPDATED, payload: {field}});
    }
}

function winCheckSubscriber(emitter, field){
    return function(){
        console.trace('WinCheckSubscriber subscriber triggered');
        if(allCellsFilled(field.getValuesFlat()) && hasWinCondition(field.getValuesFlat())){
            emitter.emit({eventName: events.WIN_CONDITION})
        }
    }
}

function startGameSubscriber(emitter){
    return function({payload: {startCellsNum}}){
        console.trace('StartGameSubscriber triggered');
        const generator = new Generator();
        const field = generator.createFieldOfNumberOfCells(startCellsNum);

        const winCheckSubscriberFn = winCheckSubscriber(emitter, field);
        const valueSetSubscriberFn = valueSetSubscriber(emitter, field);

        emitter.subscribe(events.VALUE_SET, valueSetSubscriberFn);
        emitter.subscribe(events.VALUE_SET, winCheckSubscriberFn);
        emitter.subscribe(events.WIN_CONDITION, function dispose(){
            emitter.unSubscribe(events.VALUE_SET, winCheckSubscriberFn);
            emitter.unSubscribe(events.VALUE_SET, valueSetSubscriberFn);
            emitter.unSubscribe(events.WIN_CONDITION, dispose);
        });
        emitter.emit({eventName: events.FIELD_UPDATED, payload: {field}})
    }
}

export {EventEmitter, events, startGameSubscriber};