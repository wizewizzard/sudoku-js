export default generateField;



/**
 * Generates a sudoku field represented by an array.
 * Every sequence of 9 numbers sarting from 0, 8, 17... indexes are sudoku rows.
 * Empty values are null
 * @param {*} difficulty 
 * @returns 
 */
function generateField(difficulty = 'standard'){
    // return new Promise((resolve, reject) => {
    //     const generatedField = new Array(81);

    //     generatedField.setValue = function(rowIndex, columnIndex, value){
    //         this[rowIndex * 9 + columnIndex] = value;
    //     }

    //     generatedField = basisGeneration();
    //     while(!generatedField.completed()){

    //     }
    //     resolve(generatedField);
        
    // });
    return 2;
}

function basisGeneration(fn){

}

function basisQuadrant(){
[...Array(10).keys()]
}

function getValues(){
    return [...Array(10).keys()].slice(1, 10);
}

console.log(getValues())