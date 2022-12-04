import getDifficulty from "./src/main/game/difficulty-range.js";
import { events, GameLifecycle } from "./src/main/game/gameLifeCycle.js";
import Selector from "./src/main/game/selector.js";
import { getFieldUI, getSelectorUI } from "./src/main/ui/render.js";

document.addEventListener('DOMContentLoaded', function(){
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
    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    const winConditionModalElement = document.getElementById('winConditionModal');

    const {render : renderField, clear: clearField } = getFieldUI(fieldElement);
    let {render: showSelector, hide: hideSelector} = getSelectorUI(selectorElement);
    let selector;
    const gameLifeCycle = new GameLifecycle();
    let fieldObj = null;
    let [cellSelected, supposedFlag ] = [-1, false];

    prepareField();    

    document.getElementById('difficultyRange').addEventListener('input', function(event){
        const difficulty = getDifficulty(this.value);
        const difficultyLabelElement = document.getElementById('difficultyLabel');
        difficultyLabelElement.innerHTML = difficulty.label;
        [...difficultyLabelElement.classList]
            .filter(cl => cl.startsWith("difficulty-") && cl !== `difficulty-${difficulty.code}`)
            .forEach(cl => difficultyLabelElement.classList.remove(cl));
        difficultyLabelElement.classList.add(`difficulty-${difficulty.code}`);
        document.getElementById('difficultyRangeValue').innerHTML = this.value;
    })

    document.getElementById('startNewGameButton').addEventListener('click', function(event){
        //emitter.emit({eventName: events.GAME_ENDED});
        if(gameLifeCycle.isGameInProgress){
            gameLifeCycle.end();
        }
        function renderFieldSubscriber(eventName, {field}){
            //console.trace('ValueSetSubscriber subscriber triggered');
            renderField(field);
        }

        function winConditionModalSubscriber(){
            //console.trace('winConditionModalSubscriber triggered');
            winConditionModalElement.style.display = 'block';
        }

        const startCellsNum = document.getElementById('difficultyRange').value;

        gameLifeCycle.subscribe(events.FIELD_UPDATED, renderFieldSubscriber);
        gameLifeCycle.subscribe(events.WIN_CONDITION, winConditionModalSubscriber);
        gameLifeCycle.subscribe(events.GAME_ENDED, function dispose(){
            gameLifeCycle.unSubscribe(events.WIN_CONDITION, winConditionModalSubscriber);
            gameLifeCycle.unSubscribe(events.GAME_ENDED, dispose);
            hideSelector();
        });
        gameLifeCycle.startNew(startCellsNum);
        fieldObj = gameLifeCycle.getField();
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        //emitter.emit({ eventName: events.GAME_RESTART, data: {startCellsNum}});
    });

    winConditionModalElement
        .querySelector('.fa-window-close')
            .addEventListener('click', function (){
                winConditionModalElement.style.display = 'none';
        });

    selectorElement
        .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            hideSelector();
    });
    
    // Click on field cell event fires CELL_SELECT event
    fieldElement.querySelectorAll('.cell')
        .forEach(e => e.addEventListener('click', function (event) {
            if(!fieldObj){
                throw new Error("Create field first in order to use selector");
            }
            if(selector){
                if(selector.index === Number(e.dataset.index) && selector.forSupposed === Boolean(event.ctrlKey)){
                    selector = null;
                    hideSelector();
                }
                else{
                    hideSelector();
                    selector = new Selector(fieldObj, Number(e.dataset.index), Boolean(event.ctrlKey));
                    showSelector(selector, {x: event.x, y: event.y});
                }
            }
            else{
                selector = new Selector(fieldObj, Number(e.dataset.index), Boolean(event.ctrlKey));
                showSelector(selector, {x: event.x, y: event.y});
            }
    }));

    // Click on selector's cell event fires VALUE_SET event
    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            if(selector){
                selector.setValue(Number(event.target.dataset.number));
                showSelector(selector, {})
            }
        });
    });

    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })

});


