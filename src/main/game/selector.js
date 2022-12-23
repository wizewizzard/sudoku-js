function Selector(field){
    this.field = field;

    this.setValue = function (index, value, supposed) {
        this.field.setValue(index, value, supposed);
    }

    this.isSelected = function(index, value, supposed){
        if(supposed){
            return this.field.getCell(index).getSupposedValues().indexOf(value) !== -1;
        }
        else{
            return this.field.getCell(index).getValue() === value; 
        }
    }
}

export default Selector;