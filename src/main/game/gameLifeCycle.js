import EventEmitter from "../utils/emitter.js";
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

function Emitting(emitter) {
    this.emitter = emitter;
}

Emitting.prototype.emit = function (evenName, data) {
    this.emitter.emit( evenName, data );
}

Emitting.prototype.subscribe = function (evenName, fn) {
    this.emitter.subscribe(evenName, fn);
}

Emitting.prototype.unSubscribe = function (evenName, fn) {
    this.emitter.unSubscribe(evenName, fn);
}

// Game lifecycle management tool
function GameLifecycle() {
    const emitter = new EventEmitter()
    Emitting.call(this, emitter);
}

Object.setPrototypeOf(GameLifecycle.prototype, Emitting.prototype);

GameLifecycle.prototype.startNew = function (startCellsNum) {
    const generator = new Generator();
    const field = generator.createFieldOfNumberOfCells(startCellsNum);
    this.field = new EmittingField(field, this.emitter);
    this.emit(events.GAME_START);
    this.emit(events.FIELD_UPDATED, {field});
}

GameLifecycle.prototype.restart = function () {

}

GameLifecycle.prototype.pause = function () {
    // Lock field and emit pause
}

GameLifecycle.prototype.isGameInProgress = function () {
    return false;
}

GameLifecycle.prototype.getField = function () {
    return this.field;
}

GameLifecycle.prototype.end = function () {
    this.emit(events.GAME_ENDED);
}

// Field wrapper that emits certain events
function EmittingField(field, emitter) {
    if (!field || !emitter) {
        throw new Error('Field and emitter must set for emitting field');
    }
    Emitting.call(this, emitter);
    this.field = field;
    this.locked = false;
}

Object.setPrototypeOf(EmittingField.prototype, Emitting.prototype);

EmittingField.prototype.setValue = function (index, value, supposed) {
    if (!this.field)
        throw new Error('No field set for emitting field wrapper');
    if(this.locked){
        throw new Error('Field is locked. Unable to set value');
    }
    this.field.setValue(index, value, supposed);
    if (allCellsFilled(this.field.getValuesFlat()) && hasWinCondition(this.field.getValuesFlat())) {
        this.lock();
        this.emit(events.WIN_CONDITION);
        this.emit(events.GAME_ENDED);
    }
    else {
        this.emit(events.VALUE_SET, {});
    }
    this.emit(events.FIELD_UPDATED, { field: this.field });
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

export { GameLifecycle, events};