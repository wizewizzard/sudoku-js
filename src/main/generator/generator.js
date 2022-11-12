import Field from '../field/field.js';
import {constants} from '../utils/constants.js'
import { getRandomGeneratorFromArray } from '../utils/utils.js';
const {FIELD_SIZE} = constants;

function getStandardValues(){
    return [...Array(10).keys()].splice(1, 9);
}

/**
 * Generates a sudoku field represented by an array.
 * Every sequence of 9 numbers sarting from 0, 8, 17... indexes are sudoku rows.
 * Empty values are null
 * @param {*} difficulty 
 * @returns 
 */
function generateField(difficulty = 'standard'){
    const field = new Array(FIELD_SIZE).fill(null);
    field.isConsistent = Field.prototype.isConsistent;
    const enumerationStack = [];
    enumerationStack.push({availableValues: getRandomGeneratorFromArray(getStandardValues()), index: 0});

    while(true){
        let {availableValues, index} = enumerationStack.pop();
        if(index === FIELD_SIZE) break;
        let next;
        while(!(next = availableValues.next()).done){
            field[index] = next.value;
            if(field.isConsistent()){
                enumerationStack.push({availableValues, index});
                enumerationStack.push({availableValues: getRandomGeneratorFromArray(getStandardValues()), index: index + 1 });
                break;
            }
        }
        if(next?.done){
            field[index] = null;
        }
    }
    
    return field;
}

export default generateField;