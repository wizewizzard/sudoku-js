function initSelector(field){
    if(!field)
        throw new Error("Field must not be null");
    let selectedCellIndex = -1;
    
    return {
        select(cellIndex){
            selectedCellIndex = cellIndex;
        },
        clearSelection(){
            selectedCellIndex = -1;
        },
        setValue(value, supposed){
            if(selectedCellIndex < 0)
                throw new Error("Select cell first in order to put value");
            field.setValue(selectedCellIndex, value, supposed);
        }
    }
}

export {initSelector};