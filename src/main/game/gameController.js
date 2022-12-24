import Generator from "../generator/generator.js";
import EmittingField from "../field/emittingField.js";
import Selector from "./selector.js";
import emitter from "../event/emitter.js";
import Timer from "./timer.js";
import { events } from "../event/eventsList.js";
import GameHistory from "./gameHistory.js";

function GameController() {
    const gameHistory = new GameHistory();
    gameHistory.load();
    let field;
    let selector;
    let timer;
    let isGameInProgress;

    const winSub = () => { 
        isGameInProgress = false;
        emitter.emit(events.GAME_ENDED, {});
        emitter.unSubscribe(events.WIN_CONDITION, winSub);
    };
    const endSub = () => { 
        this.cleanUp();
        gameHistory.addRecord({result: 'END', difficulty: 'UNKNOWN', time: timer.getTime()});
        gameHistory.persist();
        emitter.unSubscribe(events.GAME_ENDED, endSub);
    };

    this.start = function (startCellsNum) {
        if( isGameInProgress ) {
            emitter.emit(events.GAME_ENDED);
        }
        timer = new Timer();
        const generator = new Generator();
        field = new EmittingField(generator.createFieldOfNumberOfCells(startCellsNum));
        selector = new Selector(field);
        isGameInProgress = true;
        timer.start();
        emitter.subscribe(events.WIN_CONDITION, winSub);
        emitter.subscribe(events.GAME_ENDED, endSub);
        emitter.emit(events.GAME_START);
        emitter.emit(events.FIELD_UPDATED, {field});
        return { selector };
    }

    this.restart = function () {
        throw new Error('Not implemented');
    }

    this.cleanUp = function () {
        timer.stop();
        isGameInProgress = false;
        selector.disable();
    }
    this.pause = function () {
        selector.disable();
        timer.pause();
        emitter.emit(events.GAME_PAUSE);
    }

    this.unpause = function () {
        selector.enable();
        timer.unpause();
        emitter.emit(events.GAME_UNPAUSE);
    }

    this.isGameInProgress = function () {
        return isGameInProgress;
    }

    this.getTime = function() {
        return timer.getTime();
    }

}

export default GameController;