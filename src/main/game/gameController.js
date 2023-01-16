import Generator from "../generator/generator.js";
import EmittingField from "../field/emittingField.js";
import Selector from "./selector.js";
import emitter from "../event/emitter.js";
import Timer from "./timer.js";
import { events } from "../event/eventsList.js";
import GameHistory from "./gameHistory.js";
import getDifficulty from "./difficultyRange.js";
import Field from "../field/field.js";

function GameController() {

    this.state = {
        gameHistory: new GameHistory()
    }

    this.state.gameHistory.load();

    const startSub = () => {
        this.state.timer = new Timer();
        this.state.isGameInProgress = true;
        this.state.timer.start();
    };

    const winSub = () => { 
        this.state.isGameInProgress = false;
        this.state.victory = true;
        emitter.emit(events.GAME_ENDED, );
        emitter.unSubscribe(events.WIN_CONDITION, winSub);
    };
    const endSub = () => { 
        this.state.timer.stop();
        this.state.gameHistory.addRecord({
            result: this.state.victory ? {code: 'win', label: 'Victory'} : {code: 'lose', label: 'Lost'}, 
            difficulty: this.state.difficulty, 
            time: this.state.timer.getTime()
        });
        this.state.gameHistory.persist();
        this.state.selector.disable();
        emitter.unSubscribe(events.GAME_ENDED, endSub);
    };

    this.resetState = function () {
        this.state = {
            gameHistory: this.state.gameHistory
        };
    }

    this.start = function(startCellsNum) {
        if( this.isGameInProgress() ) {
            this.stop();
        }

        this.resetState();
        const generator = new Generator();
        const generatedArray = generator.generateConsistentFieldArrayForNumberOfCells(startCellsNum);
        this.state.initialField = new Field(generatedArray);
        this.state.field = new EmittingField(new Field([...this.state.initialField].map(v => v.getValue())));
        this.state.selector = new Selector(this.state.field);
        this.state.difficulty = getDifficulty(startCellsNum);
        
        emitter.subscribe(events.GAME_START, startSub);
        emitter.subscribe(events.WIN_CONDITION, winSub);
        emitter.subscribe(events.GAME_ENDED, endSub);

        emitter.emit(events.GAME_START);
        emitter.emit(events.FIELD_UPDATED, {field: this.state.field});
        return { selector: this.state.selector };
    }

    this.restart = function() {
        if( this.isGameInProgress() ) {
            this.stop();
        }
        this.state.field = new EmittingField(new Field([...this.state.initialField].map(v => v.getValue())));
        this.state.selector = new Selector(this.state.field);

        emitter.subscribe(events.GAME_START, startSub);
        emitter.subscribe(events.WIN_CONDITION, winSub);
        emitter.subscribe(events.GAME_ENDED, endSub);

        emitter.emit(events.GAME_START);
        emitter.emit(events.FIELD_UPDATED, {field: this.state.field});
        return { selector: this.state.selector };
    }

    this.stop = function() {
        this.state.isGameInProgress = false;
        emitter.emit(events.GAME_ENDED);
    }

    this.pause = function() {
        this.state.selector.disable();
        this.state.timer.pause();
        emitter.emit(events.GAME_PAUSE);
    }

    this.unpause = function() {
        this.state.selector.enable();
        this.state.timer.unpause();
        emitter.emit(events.GAME_UNPAUSE);
    }

    this.isGameInProgress = function() {
        return this.state.isGameInProgress;
    }

    this.getTime = function() {
        return this.state.timer.getTime();
    }

}

export default GameController;