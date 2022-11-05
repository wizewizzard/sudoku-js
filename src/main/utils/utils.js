function getRepeats(iterable){
    const repeats = new Set();
    const arrCopy = [...iterable].sort();
    for(let i = 0; i < arrCopy.length - 1; i++)
        if(arrCopy[i] === arrCopy[i + 1])
            repeats.add(arrCopy[i]);
    return Array.from(repeats);
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
    if(!(field && columnIndex >= 0 && columnIndex < 9))
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
    if(!(field && quadrantIndex >= 0 && quadrantIndex < 9))
        throw new Error("Field and quadrantIndex are mandatory.");
    return field.filter((v, i) => Math.floor(i / 27 ) * 3 + Math.floor((i / 3) % 3) === quadrantIndex);
}

function isConsistent(field){
    function isRowConsistent(index){
        const row = getRow(index);

    }
    function isColumnConsistent(index){
        
    }
    function isQuadrantConsistent(index){
        
    }
    if(!field)
        throw new Error("Field must not be null.");
    
    

    return {consistent: true};
}

export {getColumn, getQuadrant, getRow, isConsistent, getRepeats};