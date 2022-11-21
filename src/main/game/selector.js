class Selector{
    static forField(field){
        return new Selector(field);
    }

    constructor(field){
        this.disabled = false;
        this.field = field;
        this.supposed = false;
        this.selectedCellIndex = -1;
    }

    select(cellIndex, supposed){
        this.suposed = supposed;
        this.selectedCellIndex = cellIndex;
    }
    
    clearSelection(){
        this.selectedCellIndex = -1;
    }

    disable(){
        this.disabled = true;
    }

    setValue(value){
        if(!this.disabled && this.selectedCellIndex < 0)
            throw new Error("Select cell first in order to put value");
            this.field.setValue(this.selectedCellIndex, value, this.supposed);
    }

    getSelectedCell(){
        if(this.selectedCellIndex < 0)
            return null;
        return this.field.getCell(this.selectedCellIndex);
    }

    isForSupposedValue(){
        return this.supposed;
    }
}


export default Selector;