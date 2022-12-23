function Selector(field){
    this.field = field;
    this.disabled = false;

    this.setValue = function (index, value, supposed) {
        if(!this.disabled) {
            this.field.setValue(index, value, supposed);
        }
        else{
            throw new Error('Selector is disabled');
        }
    }

    this.isValueAlreadySelected = function(index, value, supposed){
        if(supposed){
            return this.field.getCell(index).getSupposedValues().indexOf(value) !== -1;
        }
        else{
            return this.field.getCell(index).getValue() === value; 
        }
    }

    this.isDisabled = function () {
        return this.disabled;
    }

    this.disable = function () {
        this.disabled = true;
    }

    this.enable = function () {
        this.disabled = false;
    }
}

export default Selector;