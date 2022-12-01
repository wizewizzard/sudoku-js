import { hasWinCondition, allCellsFilled } from "./fieldMonitoring.js";
import Generator from '../generator/generator.js'

const events = Object.freeze({
    GAME_START: 'gameStart',
    GAME_RESTART: 'gameRestart',
    GAME_ENDED: 'gameEnded',
    VALUE_SET: 'valueSet',
    CELL_SELECT: 'cellSelect',
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
            fns.delete(fn);
        }
    }
}

function startGameSubscriber(emitter){
    function valueSetSubscriber(emitter, field){
        return function({data: {index, value, supposed, ...rest}}){
            //console.trace('ValueSetSubscriber subscriber triggered');
            field.setValue(index, value, supposed);
            emitter.emit({eventName: events.FIELD_UPDATED, data: {field}});
        }
    }
    
    function winCheckSubscriber(emitter, field){
        return function(){
            //console.trace('WinCheckSubscriber subscriber triggered');
            if(allCellsFilled(field.getValuesFlat()) && hasWinCondition(field.getValuesFlat())){
                emitter.emit({eventName: events.WIN_CONDITION});
                emitter.emit({eventName: events.GAME_ENDED});
            }
        }
    }

    function cellSelectSubscriber(emitter, field){
        return function({data: {index, ...rest}}){
            //console.trace('cellSelectSubscriber triggered');
            emitter.emit({eventName: events.CELL_SELECTED, data: {cell: field.getCell(index), ...rest}})
        }
    }

    return function({data: {startCellsNum, ...rest}}){
        //console.trace('StartGameSubscriber triggered');
        const generator = new Generator();
        const field = generator.createFieldOfNumberOfCells(startCellsNum);

        const winCheckSubscriberFn = winCheckSubscriber(emitter, field);
        const valueSetSubscriberFn = valueSetSubscriber(emitter, field);
        const cellSelectSubscriberFn =  cellSelectSubscriber(emitter, field);

        emitter.subscribe(events.VALUE_SET, valueSetSubscriberFn);
        emitter.subscribe(events.VALUE_SET, winCheckSubscriberFn);
        emitter.subscribe(events.CELL_SELECT, cellSelectSubscriberFn);
        emitter.subscribe(events.GAME_ENDED, function dispose(){
            emitter.unSubscribe(events.VALUE_SET, winCheckSubscriberFn);
            emitter.unSubscribe(events.VALUE_SET, valueSetSubscriberFn);
            emitter.unSubscribe(events.CELL_SELECT, cellSelectSubscriberFn);
            emitter.unSubscribe(events.WIN_CONDITION, dispose);
        });
        emitter.emit({eventName: events.FIELD_UPDATED, data: {field}})
    }
}

export {EventEmitter, events, startGameSubscriber};