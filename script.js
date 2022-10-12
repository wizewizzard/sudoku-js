import generateField from "./generator.js";
import {getRow} from './sudoku-util.js';

const GAME_IN_PROGRESS = 1;
const GAME_NOT_STARTED = 0;

function initGame(){
    let initialField = null;
    let currentField = null;

    return {
        setField(field){
            if(field){
                initialField = field;
                currentField = initialField.map(v => {return {value: v, supposedValues: []};});
            }
            else{
                console.error('Initial field is not initialized');
            }
        },
        resetField(){
            currentField = initialField?.map(v => {return {value: v, supposedValues: []};});
        },
        getCurrentField(){
            return {
                forEach(func){
                    currentField.forEach(func);
                },
                getCell(index){
                    if(currentField){
                        if(index >= 0 && index < currentField.length){
                            return {
                                getValue(){
                                    return currentField[index].value;
                                },
                                getSupposedValues(){
                                    return currentField[index].supposedValues;
                                },
                                setOrRemoveValue( val ){
                                    console.log( 'Setting value for ', index, 'th cell: ', val );
                                    if( currentField[index].value === val ) {
                                        currentField[index].value = null;
                                    }
                                    else{
                                        currentField[index].value = val;
                                    }
                                },
                                addOrRemoveSupposedValue( val ){
                                    console.log( 'Setting supposed value for ', index, 'th cell: ', val );
                                    if( currentField[index].supposedValues?.indexOf( val ) >= 0) {
                                        currentField[index].supposedValues = currentField[index].supposedValues.filter(e => e !== val);
                                    }
                                    else{
                                        currentField[index].supposedValues.push(val)
                                    }
                                },
                            };
                        }
                    }
                },
            };
        },
        getInitialField(){
            return initialField;
        },
        
    }
}

const gameObj = initGame();


document.addEventListener('DOMContentLoaded', function(){

    const sudokuGrid = document.getElementById('sudoku-grid');
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
        sudokuGrid.append(quadrant);
    }

    function renderField(){
        gameObj.getCurrentField()?.forEach(({value, supposedValues}, index) => {
            const element = sudokuGrid.querySelectorAll('.cell')[index];
            if(value){
                element.querySelector('.value').textContent = value;
            }
            else{
                if(supposedValues && supposedValues.length > 0){
                    const supposedValuesDiv = element.querySelector('.supposedValues');
                    supposedValuesDiv.classList.remove('hidden');
                    const supposedValuesString = supposedValues.join(' ');
                    supposedValuesDiv.textContent = supposedValuesString;
                }
                else{
                    const supposedValuesDiv = element.querySelector('.supposedValues');
                    supposedValuesDiv.classList.add('hidden');
                    element.querySelector('.value').textContent = '';
                }
            }
        });
    }

    document.getElementById('startNewGameButton').addEventListener('click', function(event){
        const loader = null;
        //TODO: add loader over field
        generateField()
        .then(res => {
            gameObj.setField(res);
            renderField();
        });
    });
    
    document.getElementById('restartGameButton').addEventListener('click', function(event){
        if(gameObj.getInitialField()){
            gameObj.setField();
        }
        else{
            console.error('There\'s no field to start with');
        }
    });

    document.getElementById('numberSelector')
        .querySelector('.fa-window-close')
        .addEventListener('click', function (){
            const numberSelector = document.getElementById('numberSelector');
            numberSelector.style.display = 'none';
    });
    
    {
        let clickedCell = null;
        let supposed = null;
        
        document.querySelectorAll('#sudoku-grid .cell')
            .forEach((e, i) => e.addEventListener('click', function (event) {
                clickedCell = i;
                if(event.ctrlKey){        
                    supposed = true;
                }    
                else{
                    supposed = false;
                }
                popUpSelector( event.x, event.y );
        }));

        function popUpSelector( px, py ){
            const excluded = [];
            if ( !supposed && gameObj.getCurrentField().getCell(clickedCell).getValue()){
                excluded.push(gameObj.getCurrentField().getCell(clickedCell).getValue());
            } 
            else if( supposed && gameObj.getCurrentField().getCell(clickedCell).getSupposedValues()){
                excluded.push(gameObj.getCurrentField().getCell(clickedCell).getSupposedValues());
            }

            const numberSelector = document.getElementById('numberSelector');
            numberSelector.style.left = px +"px";
            numberSelector.style.top = py +"px";
            numberSelector.querySelectorAll('.grid3x3 > .cell')
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
            numberSelector.style.display = 'block';
        }

        document.querySelectorAll('#numberSelector .cell').forEach((e, i) => {
            e.addEventListener('click', function (event) {
                const { setOrRemoveValue, addOrRemoveSupposedValue } = gameObj.getCurrentField().getCell(clickedCell);
                if ( supposed ) {
                    addOrRemoveSupposedValue( i + 1 );
                }
                else {
                    setOrRemoveValue( i + 1 );
                }
                renderField();
            })
        });
    }

    
    
    document.getElementById('gameForm').addEventListener('submit', function(event){
        event.preventDefault();
    })
});


