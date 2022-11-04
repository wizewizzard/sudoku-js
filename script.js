import generateField from "./generator/generator.js";
import {getRow, getColumn, getQuadrant} from './utils/utils.js';
import {initField} from './field/field.js'
import {initSelector} from './field/selector.js'

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
            if(cell.value){
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
                    console.log('Nothing to render')
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

    document.getElementById('startNewGameButton').addEventListener('click', function(event){
        const loader = null;
        generateField().then(res => {
            field = initField(res);
            selector = initSelector(field);
            renderField(field);
        });
        
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
        .forEach((e, i) => e.addEventListener('click', function (event) {
            if(event.ctrlKey){        
                supposed = true;
            }    
            else{
                supposed = false;
            }
            selectorElement.style.left = event.x +"px";
            selectorElement.style.top = event.y +"px";
            selectorElement.style.display = 'block';
            selector.select(i);
            renderField(field);
    }));

    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            console.log("clicked on ", i + 1)
            selector.setValue(i + 1, supposed);
            renderField(field);
        })
    });

    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })
});


