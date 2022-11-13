import { constants } from "../utils/constants.js";
import { getColumn, getQuadrant, getRow, getRepeats, hasRepeats } from "../utils/utils.js";
const {FIELD_SIZE, COLUMNS_NUM, ROWS_NUM, QUADRANTS_NUM} = constants;

class Field{
    constructor(initialField){
        if(initialField.length != FIELD_SIZE)
            throw new Error('Invalid size of a field');
        this.initialField = [...initialField];
        this.currentField = {values: [...initialField], supposedValues: [...initialField].map(v => [])};
    }

    [Symbol.iterator](){
        const result = [];
        let index = 0;
        for(let i = 0 ; i < this.currentField.values.length; i ++){
            result.push({
                value: this.currentField.values[i], 
                supposedValues: this.currentField.supposedValues[i]
            });
        }
        return {
            next(){
                if(index < result.length){
                    return {value: result[index++], done: false};
                }
                return {done: true};
            }
        }
    }

    get length() {
        return this.currentField.values.length;
    }

    setValue(index, value, supposed){
        if(index >= 0 && index < FIELD_SIZE){
            if(supposed){
                const valueIndex = this.currentField.supposedValues[index].indexOf(value);
                if(i >= 0){
                    this.currentField.supposedValues[index].splice(i, 1);
                }
                else{
                    this.currentField.supposedValues[index].push(value);
                    this.currentField.supposedValues[index] = this.currentField.supposedValues[index].sort();
                } 
            }
            else{
                this.currentField.values[index] = value === this.currentField.values[index]? null : value;
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

    getFieldValues(){
        return [...this].map(cell => cell.value);
    }

    isConsistent(){
        const arrayFlat = this.getFieldValues();
        for( let i = 0; i < ROWS_NUM; i++){
            if(hasRepeats(getRow(arrayFlat, i)))
                return false;
        }
        for( let i = 0; i < COLUMNS_NUM; i++){
            if(hasRepeats(getColumn(arrayFlat, i)))
                return false;
        }
        for( let i = 0; i < QUADRANTS_NUM; i++){
            if(hasRepeats(getQuadrant(arrayFlat, i))){
                return false;
            }
        }
        return true;
    }
}

export default Field;