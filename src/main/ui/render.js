function getFieldUI(fieldElement){
    return{
        render (field){
            if(!field){
                console.error("No field to render");
                return;
            }
            let i = 0;
            for(const cell of field){
                const cellElement = fieldElement.querySelector(`.cell[data-index="${i}"]`)
                const supposedValuesDiv = cellElement.querySelector('.supposedValues');
                if(cell.getValue() != null){
                    if(!cell.isModifiable()){
                        cellElement.classList.add("unmodifiable");
                    }
                    else{
                        cellElement.classList.remove("unmodifiable");
                    }
                    supposedValuesDiv.classList.add('hidden');
                    cellElement.querySelector('.value').textContent = cell.getValue();
                }
                else{
                    cellElement.querySelector('.value').textContent = '';
                    if(cell.getSupposedValues() && cell.getSupposedValues().length > 0){
                        supposedValuesDiv.classList.remove('hidden');
                        const supposedValuesString = cell.getSupposedValues().join(' ');
                        supposedValuesDiv.textContent = supposedValuesString;
                    }
                    else{
                        supposedValuesDiv.classList.add('hidden');
                    }
                } 
                i++;
            }
        },
        clear(){
            // TODO: implement
        }
    }
}

function getSelectorUI({selectorElement, cell, supposed, x, y}){
    const {getSupposedValues, getValue} = cell;
    return {
        show(){
            console.log(getSupposedValues(), getValue());
            const disabledValues = supposed ? getSupposedValues() : [getValue()];
            selectorElement.querySelectorAll('.cell').forEach(element => {
                if(disabledValues.indexOf(Number(element.dataset.number )) != -1){
                    element.classList.add('selected');
                }
                else{
                    element.classList.remove('selected');
                }
            });

            if(x && y){
                selectorElement.style.left = x +"px";
                selectorElement.style.top = y +"px";
                selectorElement.style.display = 'block';
            }
        },
        update(){
            const disabledValues = supposed ? getSupposedValues() : [getValue()];
            selectorElement.querySelectorAll('.cell').forEach(element => {
                if(disabledValues.indexOf(Number(element.dataset.number )) != -1){
                    element.classList.add('selected');
                }
                else{
                    element.classList.remove('selected');
                }
            });
        },
        hide(){
            selectorElement.style.display = 'none';
        }
    }
}



export {getFieldUI, getSelectorUI};