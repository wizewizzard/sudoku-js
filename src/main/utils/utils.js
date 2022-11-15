import { constants } from "./constants.js";
const {COLUMNS_NUM, QUADRANTS_NUM} = constants;

function hasRepeats(iterable){
    const unique = Array.from(new Set(iterable)).filter(v => v != null);
    let i = 0;
    for(const val of iterable)
        if(val != null) i++;
    return unique.length != i;
}

function getRepeats(iterable){
    const copy = [...iterable];
    const repeats = [];

    repeats.addRepeat = function(_value, index1, index2){
        for(const repeat of this){
            if( _value === repeat.value){
                repeat.pos = [...new Set([...repeat.pos, index1, index2])];
                return;
            }
        }
        this.push({value: _value, pos: [index1, index2]});
    } 

    let i = 0;
    for(let i = 0 ; i < copy.length - 1; i ++){
        if(copy[i] != null){
            for( let j = i + 1; j < copy.length; j ++){
                if(copy[i] === copy[j]){
                    repeats.addRepeat(copy[i], i, j);
                }
            } 
        }
        
    }
        
    return repeats;
}

/**
 * Tests whether value can be placed at the given position
 * @param {*} field 
 * @param {*} value 
 */
function testValue(field, value, index){
    if(!(field && index && value))
        throw new Error("Field, value and index are mandatory.");

}

/**
 * Returns an array of 9 values representing a row
 * Row index starts with 0
 * @param {*} field 
 * @param {*} rowIndex 
 */
function getRow(field, rowIndex){
    if(!(field && rowIndex >= 0 && rowIndex < 9))
        throw new Error("Field and rowIndex are mandatory.");
    return field.slice(rowIndex * 9, rowIndex * 9 + 9);
}

/**
 * Returns an array of 9 values representing a column
 * Column index starts with 0
 * @param {*} field 
 * @param {*} columnIndex 
 */
function getColumn(field, columnIndex){
    if(!(field && columnIndex >= 0 && columnIndex < COLUMNS_NUM))
        throw new Error("Field and columnIndex are mandatory.");
    return field.filter((v, i) => ((i - columnIndex) % 9 ) === 0);
}

/**
 * Returns an array of 9 values representing a quadrant
 * Quadrant index starts with 0
 * @param {*} field 
 * @param {*} quadrantIndex 
 */
function getQuadrant(field, quadrantIndex){
    if(!(field && quadrantIndex >= 0 && quadrantIndex < QUADRANTS_NUM))
        throw new Error("Field and quadrantIndex are mandatory.");
    return field.filter((v, i) => Math.floor(i / 27 ) * 3 + Math.floor((i / 3) % 3) === quadrantIndex);
}

function* getRandomGeneratorFromArray(availableValues){
    function shuffle(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
    const shuffled = shuffle([...availableValues]);
    while(shuffled.length > 0){
        yield shuffled.pop();
    }
}

export {getColumn, getQuadrant, getRow, hasRepeats, getRepeats, getRandomGeneratorFromArray};