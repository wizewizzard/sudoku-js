import Generator from "../generator/generator.js";
import EmittingField from "../field/emittingField.js";
import Selector from "./selector.js";
import emitter from "../event/emitter.js";
import Timer from "./timer.js";
import { events } from "../event/eventsList.js";
import GameHistory from "./gameHistory.js";
import getDifficulty from "./difficultyRange.js";

function GameController() {
    const gameHistory = new GameHistory();
    

    this.state = {
        gameHistory: new GameHistory()
    }

    this.state.gameHistory.load();

    const winSub = () => { 
        this.state.isGameInProgress = false;
        this.state.victory = true;
        emitter.emit(events.GAME_ENDED, );
        emitter.unSubscribe(events.WIN_CONDITION, winSub);
    };
    const endSub = () => { 
        this.state.timer.stop();
        gameHistory.addRecord({
            result: this.state.victory ? {code: 'win', label: 'Victory'} : {code: 'lose', label: 'Lost'}, 
            difficulty: this.state.difficulty, 
            time: this.state.timer.getTime()
        });
        gameHistory.persist();
        this.state.selector.disable();
        this.state = {gameHistory: this.state.gameHistory};
        emitter.unSubscribe(events.GAME_ENDED, endSub);
    };

    this.start = function (startCellsNum) {
        if( this.state?.isGameInProgress ) {
            emitter.emit(events.GAME_ENDED);
        }
        this.state.timer = new Timer();
        const generator = new Generator();
        this.state.field = new EmittingField(generator.createFieldOfNumberOfCells(startCellsNum));
        this.state.selector = new Selector(this.state.field);
        this.state.difficulty = getDifficulty(startCellsNum);
        this.state.isGameInProgress = true;
        this.state.timer.start();
        emitter.subscribe(events.WIN_CONDITION, winSub);
        emitter.subscribe(events.GAME_ENDED, endSub);
        emitter.emit(events.GAME_START);
        emitter.emit(events.FIELD_UPDATED, {field: this.state.field});
        return { selector: this.state.selector };
    }

    this.restart = function () {
        throw new Error('Not implemented');
    }

    this.pause = function () {
        this.state.selector.disable();
        this.state.timer.pause();
        emitter.emit(events.GAME_PAUSE);
    }

    this.unpause = function () {
        this.state.selector.enable();
        this.state.timer.unpause();
        emitter.emit(events.GAME_UNPAUSE);
    }

    this.isGameInProgress = function () {
        return this.state.isGameInProgress;
    }

    this.getTime = function() {
        return this.state.timer.getTime();
    }

}

export default GameController;