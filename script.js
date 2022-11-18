import Generator from "./src/main/generator/generator.js";
import Selector from './src/main/game/selector.js'
import getDifficulty from "./src/main/game/difficulty-range.js";
import { EventEmitter, winCheckSubscriber, winConditionSubscriber, events } from "./src/main/game/gameLifeCycle.js";

const generator = new Generator();

document.addEventListener('DOMContentLoaded', function(){

    function renderField(field){
        if(!field){
            console.error("No field to render");
            return;
        }
        let i = 0;
        for(const cell of field){
            const cellElement = document.querySelector('#sudoku-grid').querySelector(`.cell[data-index="${i}"]`)
            const supposedValuesDiv = cellElement.querySelector('.supposedValues');
            if(cell.getValue() != null){
                if(!cell.isModifiable()){
                    cellElement.classList.add("unmodifiable");
                }
                supposedValuesDiv.classList.add('hidden');
                cellElement.querySelector('.value').textContent = cell.getValue();
            }
            else{
                cellElement.querySelector('.value').textContent = '';
                if(cell.getSupposedValues() && cell.getSupposedValues().length > 0){
                    supposedValuesDiv.classList.remove('hidden');
                    const supposedValuesString = cell.getSupposedValues().join(' ');
                    supposedValuesDiv.textContent = supposedValuesString;
                }
                else{
                    supposedValuesDiv.classList.add('hidden');
                }
            } 
            i++;
        }
    }

    function renderSelector(selector, lx, ty ){
        if(selector.getSelectedCell()){
            //selector.getSelectedCell()
        }
        if(lx && ty){
            selectorElement.style.left = lx +"px";
            selectorElement.style.top = ty +"px";
            selectorElement.style.display = 'block';
        }
    }

    function prepareField() {
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
    const eventEmitter = new EventEmitter();
    let field;
    let selector;
    const cellElements = [];
    const quadrantElements = [];

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
        const startCellsNum = document.getElementById('difficultyRange').value;
        field = generator.createFieldOfNumberOfCells(startCellsNum);
        selector = Selector.forField(field);
        eventEmitter.emit({ 
            event: events.GAME_START, 
            startCellsNum,
            field
        });
        eventEmitter.subscribe(events.VALUE_SET, winCheckSubscriber(field, eventEmitter));
        eventEmitter.subscribe(events.WIN_CONDITION, winConditionSubscriber(field, selector, eventEmitter));
        eventEmitter.subscribe(events.WIN_CONDITION, function(){
            document.getElementById('winConditionModal').style.display = "block";
        })
        renderField(field);        
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        eventEmitter.emit({ 
            event: events.GAME_RESTART
        });
    });

    winConditionModalElement
    .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            winConditionModalElement.style.display = 'none';
            
    });

    selectorElement
        .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            selector.clearSelection();
            selectorElement.style.display = 'none';
            renderField(field);
    });
    
    fieldElement.querySelectorAll('.cell')
        .forEach(e => e.addEventListener('click', function (event) {
            selector.select(e.dataset.index, Boolean(event.ctrlKey));
            eventEmitter.emit({ 
                event: events.CELL_SELECTED, 
                value: e.dataset.index 
            });
            renderSelector(selector, event.x, event.y);
            renderField(field);
    }));

    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            selector.setValue(i + 1);
            eventEmitter.emit({ 
                event: events.VALUE_SET, 
                value: i + 1
            });
            renderSelector(selector);
            renderField(field);
        })
    });

    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })

});


