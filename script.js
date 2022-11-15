import Generator from "./src/main/generator/generator.js";
import Field from './src/main/field/field.js'
import Selector from './src/main/field/selector.js'
import getDifficulty from "./src/main/ui/difficulty-range.js";

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
            if(cell.value != null){
                supposedValuesDiv.classList.add('hidden');
                cellElement.querySelector('.value').textContent = cell.value;
            }
            else{
                cellElement.querySelector('.value').textContent = '';
                if(cell.supposedValues && cell.supposedValues.length > 0){
                    supposedValuesDiv.classList.remove('hidden');
                    const supposedValuesString = cell.supposedValues.join(' ');
                    supposedValuesDiv.textContent = supposedValuesString;
                }
                else{
                    supposedValuesDiv.classList.add('hidden');
                }
            } 
            i++;
        }
    }

    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    let field;
    let selector;
    const cellElements = [];
    const quadrantElements = [];

    for ( let q = 0; q < 9; q ++ ){
        const quadrant = document.createElement('div');
        quadrant.classList.add('quadrant', 'grid3x3');
        quadrantElements.push(quadrant);
        fieldElement.append(quadrant);
    }

    for( let i = 0; i < 81; i++){
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell', 'noselect');
        const valueSpan = document.createElement('span');
        valueSpan.classList.add('value');
        const supposedValuesDiv = document.createElement('div');
        supposedValuesDiv.classList.add('supposedValues', 'hidden');
        cellElement.dataset.index = i;
        cellElement.append(supposedValuesDiv);
        cellElement.append(valueSpan);
        quadrantElements[Math.floor(i / 27 ) * 3 + Math.floor((i / 3) % 3)].append(cellElement);
    }    

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
        renderField(field);        
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        
    });

    let supposed = false;

    selectorElement
        .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            const numberSelector = document.getElementById('numberSelector');
            numberSelector.style.display = 'none';
            selector.clearSelection();
            renderField(field);
    });
    
    fieldElement.querySelectorAll('.cell')
        .forEach(e => e.addEventListener('click', function (event) {
            if(event.ctrlKey){        
                supposed = true;
            }    
            else{
                supposed = false;
            }
            const index = e.dataset.index;
            selectorElement.style.left = event.x +"px";
            selectorElement.style.top = event.y +"px";
            selectorElement.style.display = 'block';
            selector.select(index);
            renderField(field);
    }));

    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            selector.setValue(i + 1, supposed);
            renderField(field);
        })
    });

    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })
});


