import { constants } from "../utils/constants.js";
import { getColumn, getQuadrant, getRow, hasRepeats } from "../utils/utils.js";
const {FIELD_SIZE, COLUMNS_NUM, ROWS_NUM, QUADRANTS_NUM} = constants;

class Field{
    constructor(initialField){
        if(initialField.length != FIELD_SIZE)
            throw new Error('Invalid size of a field');
        this.initialField = [...initialField];
        this.currentField = [...initialField].map(v => {
            let supposedValues = [];
            let value = v;
            return {
                setValue(_value){
                    if(!this.isModifiable())
                        throw new Error("Can not set unmodifiable cell's value");
                    value = _value === value ? null : _value;
                },
                setSupposedValue(_value){
                    if(!this.isModifiable())
                        throw new Error("Can not set unmodifiable cell's value")
                    const i = supposedValues.indexOf(_value);
                    if(i >= 0){
                        supposedValues.splice(i, 1);
                    }
                    else{
                        supposedValues.push(_value);
                        supposedValues = supposedValues.sort();
                    } 
                },
                getValue(){
                    return value; 
                },
                getSupposedValues(){ 
                    return supposedValues; 
                },
                isModifiable() { 
                    return v === null; 
                }
            }});
    }

    [Symbol.iterator](){
        return this.currentField[Symbol.iterator]();
    }

    get length() {
        return this.currentField.length;
    }

    setValue(index, value, supposed){
        if(index >= 0 && index < FIELD_SIZE){
            if(supposed){
                this.currentField[index].setSupposedValue(value);
            }
            else{
                this.currentField[index].setValue(value);
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
        return this.currentField[index];
    }

    getValuesFlat(){
        return this.currentField.map(cell => cell.getValue());
    }

    isConsistent(){
        const field = this.getValuesFlat();
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

    isFilled(){
        const field = this.getValuesFlat();
        let i = 0;
        for(const cellValue of field){
            i++;
            if(cellValue === null) 
                return false;
        }
        return i === FIELD_SIZE;
    }

    hasWinCondition() {
        return this.isFilled() && this.isConsistent();
    }
}

export default Field;