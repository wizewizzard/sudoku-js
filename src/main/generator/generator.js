import Field from '../field/field.js';
import {constants} from '../utils/constants.js'
import { getRandomGeneratorFromArray } from '../utils/utils.js';
import { isConsistent } from '../game/fieldMonitoring.js';

const {FIELD_SIZE} = constants;

function getStandardValues(){
    return [...Array(10).keys()].splice(1, 9);
}

/**
     * Generates a sudoku field represented by a simple array.
     * Every sequence of 9 numbers starting from 0, 8, 17... indexes are rows.
     */
 function generateConsitentFieldArray(){
    const field = new Array(FIELD_SIZE).fill(null);
    const enumerationStack = [];
    enumerationStack.push({availableValues: getRandomGeneratorFromArray(getStandardValues()), index: 0});

    while(true){
        let {availableValues, index} = enumerationStack.pop();
        if(index === FIELD_SIZE) break;
        let next;
        while(!(next = availableValues.next()).done){
            field[index] = next.value;
            if(isConsistent(field)){
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

class Generator{
    constructor(){
        
    }
    createFieldOfNumberOfCells(numberOfCells){
        const generatedFieldArray = generateConsitentFieldArray();
        let actualValuesCount = generatedFieldArray.length;
        while(actualValuesCount > numberOfCells){
            const ordinalToRemove = Math.floor(Math.random() * actualValuesCount);
            let j = 0;
            for(let i = 0; i < generatedFieldArray.length ; i++){
                if(generatedFieldArray[i] !== null ){
                    if( j === ordinalToRemove){
                        generatedFieldArray[i] = null;
                        break;
                    } 
                    j++;
                }
                
            }
            actualValuesCount--;
        }
    
        return new Field(generatedFieldArray);
    }
}

export default Generator;
export {generateConsitentFieldArray};