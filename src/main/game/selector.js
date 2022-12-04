function Selector(field, index, forSupposed){
    this.index = index;
    this.field = field;
    this.forSupposed = forSupposed;
}

Selector.prototype.setValue = function(value){
    this.field.setValue(this.index, value, this.forSupposed)
}

Selector.prototype.getExcludedValues = function(index){
    if(this.forSupposed){
        return this.field.getCell(this.index).getSupposedValues();
    }
    else{
        return [this.field.getCell(this.index).getValue()]; 
    }
}


export default Selector;