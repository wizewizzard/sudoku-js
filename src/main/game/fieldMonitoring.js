import { constants } from "../utils/constants.js";
import { hasRepeats, getRow, getColumn, getQuadrant } from "../utils/utils.js";

const {ROWS_NUM, COLUMNS_NUM, QUADRANTS_NUM, FIELD_SIZE} = constants;

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

function allCellsFilled(field){
    let i = 0;
    for(const cellValue of field){
        i++;
        if(cellValue === null) 
            return false;
    }
    return i === FIELD_SIZE;
}

function hasWinCondition(field){
    return isConsistent(field);
}

export {isConsistent, hasWinCondition, allCellsFilled};