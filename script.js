import getDifficulty from "./src/main/game/difficulty-range.js";
import { EventEmitter, startGameSubscriber, events } from "./src/main/game/gameLifeCycle.js";
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
    const {render : renderField, clear: clearField } = getFieldUI(fieldElement);
    let showSelector, updateSelector, hideSelector;
    const winConditionModalElement = document.getElementById('winConditionModal');
    const emitter = new EventEmitter();
    let [cellSelected, supposedFlag ] = [-1, false];
    emitter.subscribe(events.GAME_START, startGameSubscriber(emitter))

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
        emitter.emit({eventName: events.GAME_ENDED});
        function renderFieldSubscriber({data: {field}}){
            //console.trace('ValueSetSubscriber subscriber triggered');
            renderField(field);
        }

        function winConditionModalSubscriber(){
            //console.trace('winConditionModalSubscriber triggered');
            winConditionModalElement.style.display = 'block';
        }

        function renderSelectorSubscriber({data: {cell, ...rest}}){
            //console.trace('renderSelectorSubscriber triggered');
            if(cell){
                ({show: showSelector, update: updateSelector, hide: hideSelector} = getSelectorUI({selectorElement, cell, ...rest}));
                showSelector();
            }
            else{
                hideSelector();
            }
        }

        const startCellsNum = document.getElementById('difficultyRange').value;
        emitter.subscribe(events.FIELD_UPDATED, renderFieldSubscriber);
        emitter.subscribe(events.WIN_CONDITION, winConditionModalSubscriber);
        emitter.subscribe(events.CELL_SELECTED, renderSelectorSubscriber);
        emitter.subscribe(events.GAME_ENDED, function dispose(){
            emitter.unSubscribe(events.FIELD_UPDATED, renderFieldSubscriber);
            emitter.unSubscribe(events.WIN_CONDITION, winConditionModalSubscriber);
            emitter.unSubscribe(events.GAME_ENDED, dispose);
            hideSelector();
        });
        emitter.emit({eventName: events.GAME_START, data: {startCellsNum}});
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        emitter.emit({ eventName: events.GAME_RESTART, data: {startCellsNum}});
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
            cellSelected = cellSelected && Number(e.dataset.index) === cellSelected ? null : Number(e.dataset.index);
            console.log('Ctrl key down: ', Boolean(event.ctrlKey));
            supposedFlag = Boolean(event.ctrlKey);
            emitter.emit({
                eventName: events.CELL_SELECT,
                data:
                {
                    index: cellSelected,
                    supposed: supposedFlag,
                    x: event.x,
                    y: event.y
                }
            });
    }));

    // Click on selector's cell event fires VALUE_SET event
    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            emitter.emit({ 
                eventName: events.VALUE_SET, 
                data: {
                    value: Number(e.dataset.number), 
                    index: cellSelected, 
                    supposed: supposedFlag 
                }
            });
            updateSelector();
        });
    });

    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })

});


