import generateField from "./generator.js";
import {getRow} from './sudoku-util.js';

const GAME_IN_PROGRESS = 1;
const GAME_NOT_STARTED = 0;

const fieldState = {
    state: GAME_NOT_STARTED,
    setCellValue({index, value, supposedValues}){
        if(this.status === GAME_IN_PROGRESS){

            this.currentField[index] = value;
        }
    },
};
const sudokuGrid = document.getElementById('sudoku-grid');

function renderField(){
    fieldState.currentField?.forEach((cell, index) => {
        renderCell({index, value: cell.value, supposedValues: cell.supposedValues});
    });

}

function showNumberSelectPopup(){

}

function hideNumberSelectPopup(){

}

function setSupposedCellValue(){

}

function renderCell({index, value, supposedValues}){
    const element = sudokuGrid.querySelectorAll('td')[index];
    if(value){
        element.textContent = value;
    }
    else{
        if(supposedValues && supposedValues.length > 0){
            const supposedValuesDiv = document.createElement("div");
            supposedValuesDiv.className = 'supposedValuesContainer';
            const supposedValuesString = supposedValues.join(',').slice(0, -1);
        }
    }
}

document.getElementById('startNewGameButton').addEventListener('click', function(event){
    generateField()
    .then(res => {
        fieldState.state = GAME_IN_PROGRESS;
        fieldState.initialField = res;
        fieldState.currentField = res.map(e => {return {supposedValues: [], value: e}});
        renderField();
    })
});

document.getElementById('restartGameButton').addEventListener('click', function(event){
    if(fieldState.initialField){
        fieldState.currentField = fieldState.initialField;
    }
})

document.querySelectorAll('#sudoku-grid > tbody > tr > td').forEach((e, i) => e.addEventListener('click', function (event) {
    console.log('Clicked on td with index: ', i);
    
}));

document.getElementById('gameForm').addEventListener('submit', function(event){
    event.preventDefault();
})
