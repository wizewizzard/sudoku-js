import getDifficulty from "./src/main/game/difficulty-range.js";
import { events, GameLifecycle } from "./src/main/game/gameLifeCycle.js";
import Selector from "./src/main/game/selector.js";
import { getFieldUI, getSelectorUI, getTimerUI } from "./src/main/ui/render.js";
import Timer from './src/main/game/timer.js'

document.addEventListener('DOMContentLoaded', function () {
    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    const timerDisplayElement = document.getElementById('timerDisplay');
    const winConditionModalElement = document.getElementById('winConditionModal');
    const pauseButtonElement = document.getElementById('pauseGameButton');

    document.getElementById('gameForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    function prepareField() {
        const quadrantElements = [];
        for (let q = 0; q < 9; q++) {
            const quadrant = document.createElement('div');
            quadrant.classList.add('quadrant', 'grid3x3');
            quadrantElements.push(quadrant);
            fieldElement.append(quadrant);
        }

        for (let i = 0; i < 81; i++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell', 'noselect');
            const valueSpan = document.createElement('span');
            valueSpan.classList.add('value');
            const supposedValuesDiv = document.createElement('div');
            supposedValuesDiv.classList.add('supposedValues', 'hidden');
            cellElement.dataset.index = i;
            cellElement.append(supposedValuesDiv);
            cellElement.append(valueSpan);
            quadrantElements[Math.floor(i / 27) * 3 + Math.floor((i / 3) % 3)].append(cellElement);
        }
    }

    prepareField();

    const { render: renderField, clear: clearField } = getFieldUI(fieldElement);
    let { render: showSelector, hide: hideSelector } = getSelectorUI(selectorElement);
    let { render: renderTimer, zero: clearTimer } = getTimerUI(timerDisplayElement);
    const gameLifeCycle = new GameLifecycle();
    let selector;
    let fieldObj;
    let timerObj;

    document.getElementById('difficultyRange').addEventListener('input', function (event) {
        const difficulty = getDifficulty(this.value);
        const difficultyLabelElement = document.getElementById('difficultyLabel');
        difficultyLabelElement.innerHTML = difficulty.label;
        [...difficultyLabelElement.classList]
            .filter(cl => cl.startsWith("difficulty-") && cl !== `difficulty-${difficulty.code}`)
            .forEach(cl => difficultyLabelElement.classList.remove(cl));
        difficultyLabelElement.classList.add(`difficulty-${difficulty.code}`);
        document.getElementById('difficultyRangeValue').innerHTML = this.value;
    })

    document.getElementById('startNewGameButton').addEventListener('click', function (event) {
        if (gameLifeCycle.isGameInProgress()) {
            gameLifeCycle.end();
        }

        const startCellsNum = document.getElementById('difficultyRange').value;
        gameLifeCycle.init(startCellsNum);
        ([fieldObj, timerObj] = [gameLifeCycle.getField(), new Timer()]);
        const updateSub = () => { renderField(fieldObj); }
        const winSub = () => { winConditionModalElement.style.display = 'block'; }
        const startSub = () => {
            timerObj.start();
            timerObj.attachedInterval = setInterval(() => renderTimer(timerObj), 80);
        };
        const pauseSub = () => { timerObj.pause(); }
        const unpauseSub = () => { timerObj.unpause(); }
        const endSub = () => {
            stopTimer(timerObj);
            timerObj = null;
            gameLifeCycle.unSubscribe(events.FIELD_UPDATED, updateSub);
            gameLifeCycle.unSubscribe(events.WIN_CONDITION, winSub);
            gameLifeCycle.unSubscribe(events.GAME_START, startSub);
            gameLifeCycle.unSubscribe(events.GAME_PAUSE, pauseSub);
            gameLifeCycle.unSubscribe(events.GAME_UNPAUSE, unpauseSub);
            gameLifeCycle.unSubscribe(events.GAME_ENDED, endSub);
        }

        gameLifeCycle.subscribe(events.FIELD_UPDATED, updateSub);
        gameLifeCycle.subscribe(events.WIN_CONDITION, winSub);
        gameLifeCycle.subscribe(events.GAME_START, startSub);
        gameLifeCycle.subscribe(events.GAME_PAUSE, pauseSub);
        gameLifeCycle.subscribe(events.GAME_UNPAUSE, unpauseSub);
        gameLifeCycle.subscribe(events.GAME_ENDED, endSub);

        gameLifeCycle.start();
    });

    document.getElementById('restartGameButton').addEventListener('click', function (event) {
        //emitter.emit({ eventName: events.GAME_RESTART, data: {startCellsNum}});
    });

    pauseButtonElement.addEventListener('click', function (event) {
        if (!timerObj) {
            console.error('Timer is not running');
            return;
        }
        if (pauseButtonElement.value === 'Pause') {
            timerObj.pause();
            pauseButtonElement.value = 'Unpause';
            pauseButtonElement.innerHTML = '<span class="buttonText">Unpause</span>'
        }
        else {
            timerObj.unpause();
            pauseButtonElement.value = 'Pause';
            pauseButtonElement.innerHTML = '<span class="buttonText">Pause</span>';
        }
    });

    winConditionModalElement.querySelector('.fa-window-close').addEventListener('click', function () {
        winConditionModalElement.style.display = 'none';
    });

    selectorElement.querySelector('.fa-window-close').addEventListener('click', function () {
        selector = null;
        hideSelector();
    });

    // Click on field cell event fires CELL_SELECT event
    fieldElement.querySelectorAll('.cell')
        .forEach(e => e.addEventListener('click', function (event) {
            if (!fieldObj) {
                throw new Error("Create field first in order to use selector");
            }
            if (selector) {
                if (selector.index === Number(e.dataset.index) && selector.forSupposed === Boolean(event.ctrlKey)) {
                    selector = null;
                    hideSelector();
                }
                else {
                    hideSelector();
                    selector = new Selector(fieldObj, Number(event.target.dataset.index), Boolean(event.ctrlKey));
                    showSelector(selector, { x: event.x, y: event.y });
                }
            }
            else {
                selector = new Selector(fieldObj, Number(event.target.dataset.index), Boolean(event.ctrlKey));
                showSelector(selector, { x: event.x, y: event.y });
            }
        }));

    // Click on selector's cell event fires VALUE_SET event
    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            if (selector) {
                selector.setValue(Number(event.target.dataset.number));
                showSelector(selector, {})
            }
        });
    });

});


function stopTimer(timer) {
    console.log('Stopping imer');
    if (timer) {
        timer.stop();
        if(timer.attachedInterval)
            clearInterval(timer.attachedInterval);
    }
}

