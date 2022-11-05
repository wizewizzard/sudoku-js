function initField(field){
    let initialField = [...field];
    let currentField = initialField.map(v => {return {value: v, supposedValues: []}});

    return {
        getCell(index){
            return {
                value: currentField[index].value,
                supposedValues: currentField[index].supposedValues
            }
        },
        [Symbol.iterator](){
            return currentField[Symbol.iterator]();
        },
        get length() {
            return currentField.length;
        },
        setValue(index, value, supposed){
            if(index >= 0){
                if(supposed){
                    const i = currentField[index].supposedValues.indexOf(value);
                    if(i >= 0) currentField[index].supposedValues.splice(i, 1);
                    else{
                        currentField[index].supposedValues.push(value);
                        currentField[index].supposedValues = currentField[index].supposedValues.sort();
                    } 
                }
                else{
                    currentField[index].value = value === currentField[index].value ? null : value;
                }
            }
            else{
                console.error("There's no cell selected to perform this operation");
            }
        }
    }
}

export {initField};