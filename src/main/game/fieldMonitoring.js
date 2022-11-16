import { constants } from "../utils/constants.js";
import { hasRepeats, getRow, getColumn, getQuadrant } from "../utils/utils.js";

const {ROWS_NUM, COLUMNS_NUM, QUADRANTS_NUM} = constants;

function isConsistent(field){
    for( let i = 0; i < ROWS_NUM; i++){
        if(hasRepeats(getRow(field, i)))
            return false;
    }
    for( let i = 0; i < COLUMNS_NUM; i++){
        if(hasRepeats(getColumn(field, i)))
            return false;
    }
    for( let i = 0; i < QUADRANTS_NUM; i++){
        if(hasRepeats(getQuadrant(field, i))){
            return false;
        }
    }
    return true;
}

function checkWinCondition(field){
    for(const cellValue of field){
        if(cellValue === null) 
            return false;
    }
    return isConsistent(field);
}

export {isConsistent, checkWinCondition};