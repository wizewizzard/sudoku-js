class Selector{
    static forField(field){
        return new Selector(field);
    }

    constructor(field){
        this.field = field;
        this.selectedCellIndex = -1;
    }

    select(cellIndex){
        this.selectedCellIndex = cellIndex;
    }
    
    clearSelection(){
        this.selectedCellIndex = -1;
    }
    
    setValue(value, supposed){
        if(this.selectedCellIndex < 0)
            throw new Error("Select cell first in order to put value");
            this.field.setValue(this.selectedCellIndex, value, supposed);
    }
}


export default Selector;