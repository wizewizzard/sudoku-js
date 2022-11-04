export default generateField;

/**
 * Generates a sudoku field represented by an array.
 * Every sequence of 9 numbers sarting from 0, 8, 17... indexes are sudoku rows.
 * Empty values are null
 * @param {*} difficulty 
 * @returns 
 */
function generateField(difficulty = 'standard'){

    return new Promise((resolve, reject) => {
        setTimeout(function() {
            const res = [];
            for( let i = 0; i < 81 ; i ++){
                res.push((Math.round(Math.random() * 8) + 1))
            }
            resolve(res);
        }, 1000);
        
    });
}