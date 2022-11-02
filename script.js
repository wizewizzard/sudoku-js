import generateField from "./generator.js";
import {getRow} from './sudoku-util.js';

const GAME_IN_PROGRESS = 1;
const GAME_NOT_STARTED = 0;

function initField(){
    let initialField = null;
    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    let currentField = null;

    function renderField(){
        if( currentField ){
            currentField.forEach(({value, supposedValues}, index) => {
                const cellElement = fieldElement.querySelectorAll('.cell')[index];
                if(value){
                    cellElement.querySelector('.value').textContent = value;
                }
                else{
                    if(supposedValues && supposedValues.length > 0){
                        const supposedValuesDiv = cellElement.querySelector('.supposedValues');
                        supposedValuesDiv.classList.remove('hidden');
                        const supposedValuesString = supposedValues.join(' ');
                        supposedValuesDiv.textContent = supposedValuesString;
                    }
                    else{
                        const supposedValuesDiv = cellElement.querySelector('.supposedValues');
                        supposedValuesDiv.classList.add('hidden');
                        cellElement.querySelector('.value').textContent = '';
                    }
                }
            });
        }
    }

    return {
        setField(field){
            if(field){
                initialField = field;
                currentField = initialField.map(v => {return {value: v, supposedValues: []};});
            }
            else{
                console.error('Initial field is not initialized');
            }
            renderField();
        },
        resetField(){
            currentField = initialField?.map(v => {return {value: v, supposedValues: []};});
            renderField();
        },
        getCell(index) {
            let clickedCellIndex = index;

            function renderSelector( ){
                const excluded = [];
                if ( clickedCellIndex && currentField[clickedCellIndex].value ){
                    excluded.push(currentField[clickedCellIndex].value );
                }
                else if( clickedCellIndex && currentField[clickedCellIndex].supposedValues ){
                    excluded.push(currentField[clickedCellIndex].supposedValues);
                }
        
                selectorElement.querySelectorAll('.grid3x3 > .cell')
                    .forEach((e, i) => {
                        if(excluded.includes(i + 1)){
                            e.classList.add('disabled');
                            e.classList.remove('enabled');
                        }
                        else{
                            e.classList.add('enabled');
                            e.classList.remove('disabled');
                        }
                    });
                }

            return {
                setOrRemoveValue(value){
                    console.log( 'Setting value for ', clickedCellIndex, 'th cell: ', value );
                    if( currentField[clickedCellIndex].value === value ) {
                        currentField[clickedCellIndex].value = null;
                    }
                    else{
                        currentField[clickedCellIndex].value = value;
                    }
                    renderSelector();
                    renderField();
                },
                addOrRemoveSupposedValue( value ){
                    console.log( 'Setting supposed value for ', clickedCellIndex, 'th cell: ', value );
                    if( currentField[clickedCellIndex].supposedValues?.indexOf( value ) >= 0) {
                        currentField[clickedCellIndex].supposedValues = currentField[clickedCellIndex].supposedValues.filter(e => e !== value);
                    }
                    else{
                        currentField[clickedCellIndex].supposedValues.push(value)
                    }
                    renderSelector();
                    renderField();
                }
            }
        },        
    }
}

const fieldManager = initField();


document.addEventListener('DOMContentLoaded', function(){

    const fieldElement = document.getElementById('sudoku-grid');
    const selectorElement = document.getElementById('numberSelector');
    let selectorHandler = null;

    for ( let q = 0; q < 9; q ++ ){
        const quadrant = document.createElement('div');
        quadrant.classList.add('quadrant', 'grid3x3');
        for (let i = 0; i < 9 ; i ++){
            const cell = document.createElement('div');
            cell.classList.add('cell', 'noselect');
            const valueSpan = document.createElement('span');
            valueSpan.classList.add('value');
            const supposedValuesDiv = document.createElement('div');
            supposedValuesDiv.classList.add('supposedValues', 'hidden');
            cell.append(supposedValuesDiv);
            cell.append(valueSpan);
            quadrant.append(cell);
        }
        fieldElement.append(quadrant);
    }

    document.getElementById('startNewGameButton').addEventListener('click', function(event){
        const loader = null;
        //TODO: add loader over field
        generateField()
        .then(res => {
            fieldManager.setField(res);
        });
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        if(fieldManager.getInitialField()){
            fieldManager.setField();
        }
        else{
            console.error('There\'s no field to start with');
        }
    });

    selectorElement
        .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            const numberSelector = document.getElementById('numberSelector');
            numberSelector.style.display = 'none';
    });
    
    fieldElement.querySelectorAll('.cell')
        .forEach((e, i) => e.addEventListener('click', function (event) {
            const { setOrRemoveValue, addOrRemoveSupposedValue } = fieldManager.getCell(i);
            if(event.ctrlKey){        
                selectorHandler = addOrRemoveSupposedValue;
            }    
            else{
                selectorHandler = setOrRemoveValue;
            }
            selectorElement.style.left = event.x, +"px";
            selectorElement.style.top = event.y +"px";
            selectorElement.style.display = 'block';
    }));

    selectorElement.querySelectorAll('.cell').forEach((e, i) => {
        e.addEventListener('click', function (event) {
            selectorHandler?.( i + 1 );
        })
    });


    
    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })
});


