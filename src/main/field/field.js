import { constants } from "../utils/constants.js";
import { getColumn, getQuadrant, getRow, getRepeats } from "../utils/utils.js";
const {FIELD_SIZE, COLUMNS_NUM, ROWS_NUM, QUADRANTS_NUM} = constants;

class Field{
    constructor(initialField){
        if(initialField.length != FIELD_SIZE)
            throw new Error('Invalid size of a field');
        this.initialField = [...initialField];
        this.currentField = initialField.map(v => {return {value: v, supposedValues: []}});
    }
    [Symbol.iterator](){
        return currentField[Symbol.iterator]();
    }
    get length() {
        return this.currentField.length;
    }
    setValue(index, value, supposed){
        if(index >= 0){
            if(supposed){
                const i = this.currentField[index].supposedValues.indexOf(value);
                if(i >= 0){
                    this.currentField[index].supposedValues.splice(i, 1);
                }
                else{
                    this.currentField[index].supposedValues.push(value);
                    this.currentField[index].supposedValues = this.currentField[index].supposedValues.sort();
                } 
            }
            else{
                this.currentField[index].value = value === this.currentField[index].value ? null : value;
            }
        }
        else{
            console.error("There's no cell selected to perform this operation");
        }
    }
    getRow(rowIndex){
        return getRow(this.currentField, rowIndex);
    }

    getColumn(columnIndex){
        return getColumn(this.currentField, columnIndex);
    }

    getQuadrant(quadrantIndex){
        return getQuadrant(this.currentField, quadrantIndex);
    }
    getCell(index){
        if(!(index >= 0 && index < FIELD_SIZE))
            throw new Error('Invalid index given');
        return {
            value: this.currentField[index].value,
            supposedValues: this.currentField[index].supposedValues
        }
    }
    isConsistent(){  
        const arrayFlat = this.currentField.map(c => c.value);
        console.log(getRepeats(getRow(arrayFlat, 0)))
        for( let i = 0; i < ROWS_NUM; i++){
            if(getRepeats(getColumn(arrayFlat, i)).length > 0)
                return false;
        }
        for( let i = 0; i < COLUMNS_NUM; i++){
            if(getRepeats(getColumn(arrayFlat, i)).length > 0)
                return false;
        }
        for( let i = 0; i < QUADRANTS_NUM; i++){
            if(getRepeats(getQuadrant(arrayFlat, i)).length > 0){
                return false;
            }
        }
        return true;
    }
}

export default Field;