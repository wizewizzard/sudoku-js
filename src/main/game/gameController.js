import Generator from "../generator/generator.js";
import EmittingField from "../field/emittingField.js";
import Selector from "./selector.js";
import emitter from "../event/emitter.js";
import Timer from "./timer.js";
import { events } from "../event/eventsList.js";

function GameController() {
    const gameHistory = {};
    let field;
    let selector;
    let timer;
    let isGameInProgress;

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
        emitter.emit(events.GAME_START);
        emitter.emit(events.FIELD_UPDATED, {field});
        function winSub() { 
            isGameInProgress = false;
            emitter.emit(events.GAME_ENDED, {});
            emitter.unSubscribe(events.WIN_CONDITION, winSub);
        };
        function endSub () { 
            timer.stop();
            emitter.unSubscribe(events.GAME_ENDED, endSub);
        };

        emitter.subscribe(events.WIN_CONDITION, winSub);
        emitter.subscribe(events.GAME_ENDED, endSub);
        return { selector };
    }

    this.restart = function () {
        throw new Error('Not implemented');
    }

    this.end = function () {
        timer.stop();
        isGameInProgress = false;
        emitter.emit(events.GAME_ENDED);
    }
    this.pause = function () {
        timer.pause();
        emitter.emit(events.GAME_PAUSE);
    }

    this.unpause = function () {
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