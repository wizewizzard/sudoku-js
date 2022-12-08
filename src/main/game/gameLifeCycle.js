import EventEmitter from "../utils/emitter.js";
import { hasWinCondition, allCellsFilled } from "./fieldMonitoring.js";
import Generator from '../generator/generator.js';
import Field from "../field/field.js";
import Timer from "./timer.js";

const events = Object.freeze({
    GAME_START: 'gameStart',
    GAME_PAUSE: 'gamePause',
    GAME_UNPAUSE: 'gameUnpause',
    GAME_RESTART: 'gameRestart',
    GAME_ENDED: 'gameEnded',
    VALUE_SET: 'valueSet',
    CELL_SELECT: 'cellSelect',
    CELL_SELECTED: 'cellSelected',
    FIELD_UPDATED: 'fieldUpdated',
    FIELD_FILLED: 'fieldIsFull',
    WIN_CONDITION: 'winCondition'
});

function Emitting(emitter) {
    this.emitter = emitter;
}

Emitting.prototype.emit = function (evenName, data) {
    this.emitter.emit(evenName, data);
}

Emitting.prototype.subscribe = function (evenName, fn) {
    this.emitter.subscribe(evenName, fn);
}

Emitting.prototype.unSubscribe = function (evenName, fn) {
    this.emitter.unSubscribe(evenName, fn);
}

// Game lifecycle management tool
function GameLifecycle() {
    Emitting.call(this, new EventEmitter());
    const timer = new Timer();
    let field;
    let isGameInProgressFlag;

    this.createField = function (startCellsNum) {
        const generator = new Generator();
        field = new EmittingField(generator.createFieldOfNumberOfCells(startCellsNum), this.emitter);
    }

    this.pause = function () {
        field.lock();
        timer.pause();
    }

    this.unpause = function () {
        field.unlock();
        timer.unpause();
    }

    this.start = function () {
        isGameInProgressFlag = true;
        timer.start();
        this.emit(events.GAME_START);
        this.emit(events.FIELD_UPDATED);
    }

    this.restart = function () {
        throw new Error('Not implemented');
    }

    this.end = function () {
        timer.stop();
        this.emit(events.GAME_ENDED);
    }

    this.getField = function () {
        return field;
    }

    this.isGameInProgress = function () {
        return isGameInProgressFlag;
    }

    this.getTime = function() {
        return timer.getTime();
    }

    this.createHistoryRecord = function () {
        console.log('Should persist game difficulty, result and time when game ends');
        throw new Error('Not implemented yet')
    }
}

GameLifecycle.prototype.emit = Emitting.prototype.emit;
GameLifecycle.prototype.subscribe = Emitting.prototype.subscribe;
GameLifecycle.prototype.unSubscribe = Emitting.prototype.unSubscribe;

// Field wrapper that emits certain events
function EmittingField(field, emitter) {
    if (!field || !emitter) {
        throw new Error('Field and emitter must set for emitting field');
    }
    Emitting.call(this, emitter);
    this.field = field;
    this.locked = false;
}

Object.setPrototypeOf(EmittingField.prototype, Field.prototype);
EmittingField.prototype.emit = Emitting.prototype.emit;
EmittingField.prototype.subscribe = Emitting.prototype.subscribe;
EmittingField.prototype.unSubscribe = Emitting.prototype.unSubscribe;

EmittingField.prototype.setValue = function (index, value, supposed) {
    if (!this.field)
        throw new Error('No field set for emitting field wrapper');
    if (this.locked) {
        throw new Error('Field is locked. Unable to set value');
    }
    this.field.setValue(index, value, supposed);
    this.emit(events.FIELD_UPDATED, { field: this.field });
    if (allCellsFilled(this.field.getValuesFlat()) && hasWinCondition(this.field.getValuesFlat())) {
        this.lock();
        this.emit(events.WIN_CONDITION);
        this.emit(events.GAME_ENDED);
    }
    else {
        this.emit(events.VALUE_SET, {});
    }
}

EmittingField.prototype.getCell = function (index) {
    if (!this.field)
        throw new Error('No field set for emitting field wrapper');
    return this.field.getCell(index);
}

EmittingField.prototype.lock = function () {
    this.locked = true;
}

EmittingField.prototype.unlock = function () {
    this.locked = false;
}

EmittingField.prototype[Symbol.iterator] = function () {
    return this.field[Symbol.iterator]();
}

export { GameLifecycle, events };