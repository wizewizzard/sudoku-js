import getDifficulty from "./src/main/game/difficultyRange.js";
import { events } from "./src/main/event/eventsList.js";
import { getFieldUI, getSelectorUI, getTimerUI, formatMsForTimer } from "./src/main/ui/render.js";
import emitter from "./src/main/event/emitter.js";
import GameController from "./src/main/game/gameController.js";

const log = console.log;
const debug = console.debug;

document.addEventListener('DOMContentLoaded', function () {
    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    const timerDisplayElement = document.getElementById('timerDisplay');
    const winConditionModalElement = document.getElementById('winConditionModal');
    const pauseButtonElement = document.getElementById('pauseGameButton');
    const timerResultElement = document.getElementById('timeResult');
    const gameHistoryElement = document.getElementById('gameHistoryList');

    const updateSub = (_, {field}) => { renderField(field); }
    const timerPollSub = () => { timerPollInterval = setInterval(() => renderTimer(gameController.getTime()), 80); };
    const timerPollStopSub = () => {
        if (timerPollInterval ) {
            clearInterval(timerPollInterval);
            timerPollInterval = null;
        }
    }
    const winSub = () => {
        timerResultElement.textContent = formatMsForTimer(gameController.getTime());
        winConditionModalElement.classList.remove('hidden');
    }
    const historySub = function (_, {history}) {
        log('Histroy: ', history);
        const elements = history.map(rec => {
            const listRecordElement = document.createElement('li');
            listRecordElement.innerHTML = rec.result.label + ' ' + rec.difficulty.label + ' ' + formatMsForTimer(rec.time); 
            return listRecordElement;
        })
        .reverse();
        gameHistoryElement.innerHTML = '';
        gameHistoryElement.append(...elements)
    }

    emitter.subscribe(events.FIELD_UPDATED, updateSub);
    emitter.subscribe(events.GAME_START, timerPollSub);
    emitter.subscribe(events.GAME_ENDED, timerPollStopSub);
    emitter.subscribe(events.WIN_CONDITION, winSub);
    emitter.subscribe(events.HISTORY_UPDATED, historySub);

    const gameController = new GameController();
    let selector;
    let timerPollInterval;
    let selectedCellIndex, supposedFlag;

    document.getElementById('gameForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    (function prepareField() {
        const selectorGrid = selectorElement.querySelector('.grid3x3');
        for( let i = 0; i < 9 ; i ++) {
            const cellElement = document.createElement('div');
            const numberSpan = document.createElement('span');
            numberSpan.textContent = i + 1
            cellElement.classList.add('cell', 'noselect');
            cellElement.dataset.number = i + 1;
            cellElement.append(numberSpan); 
            selectorGrid.append(cellElement);
        }

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
    })();

    let { render: renderField, clear: clearField } = getFieldUI(fieldElement);
    let { render: showSelector, hide: hideSelector } = getSelectorUI(selectorElement);
    let { render: renderTimer, zero: clearTimer } = getTimerUI(timerDisplayElement);    

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
        if (gameController.isGameInProgress()) {
            gameController.stop();
        }

        clearTimer();
        clearField();
        hideSelector();
        const startCellsNum = document.getElementById('difficultyRange').value;
        ({ selector } = gameController.start(startCellsNum));
        
        const endSub = () => {
            hideSelector();
            emitter.unSubscribe(events.GAME_ENDED, endSub);
        }

        emitter.subscribe(events.GAME_ENDED, endSub);
    });

    document.getElementById('restartGameButton').addEventListener('click', function (event) {
        ({ selector } = gameController.restart());
    });

    pauseButtonElement.addEventListener('click', function (event) {
        if (!gameController.isGameInProgress) {
            console.error('Game is not running');
            return;
        }
        if (pauseButtonElement.value === 'Pause') {
            gameController.pause();
            pauseButtonElement.value = 'Unpause';
            pauseButtonElement.innerHTML = '<span class="buttonText">Unpause</span>'
        }
        else {
            gameController.unpause();
            pauseButtonElement.value = 'Pause';
            pauseButtonElement.innerHTML = '<span class="buttonText">Pause</span>';
        }
    });

    winConditionModalElement.querySelector('.fa-window-close').addEventListener('click', function () {
        winConditionModalElement.classList.add('hidden');
    });

    selectorElement.querySelector('.fa-window-close').addEventListener('click', function () {
        hideSelector();
    });

    fieldElement.querySelectorAll('.cell')
        .forEach(e => e.addEventListener('click', function (event) {
            if (selector) {
                if (selectedCellIndex === Number(e.dataset.index) && supposedFlag === Boolean(event.ctrlKey)) {
                    hideSelector();
                    ([selectedCellIndex, supposedFlag] = [null, null])
                }
                else {
                    ([selectedCellIndex, supposedFlag] = [Number(e.dataset.index), Boolean(event.ctrlKey)]);
                    showSelector(selector, { index: selectedCellIndex, supposed: supposedFlag, x: event.x, y: event.y });
                }
            }
            else {
                throw new Error('There\'s no selector initialized for the field');
            }
        }));

    selectorElement.querySelectorAll('.cell')
        .forEach((e, i) => {
            e.addEventListener('click', function (event) {
                if (selector) {
                    selector.setValue(selectedCellIndex, Number(e.dataset.number), supposedFlag);
                    showSelector(selector, { index: selectedCellIndex, supposed: supposedFlag });
                }
                else {
                    throw new Error('There\'s no selector initialized for the field');
                }
            });
        });

});

