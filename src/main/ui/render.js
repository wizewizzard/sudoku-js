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

function getSelectorUI(selectorElement){
    return {
        render(selector, {x, y}){
            if(!selector){
                console.error("No selector to render");
                return;
            }
            selectorElement.querySelectorAll('.cell').forEach(element => {
                if(selector.getExcludedValues().indexOf(Number(element.dataset.number )) != -1){
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
        hide(){
            selectorElement.style.display = 'none';
        }
    };
}



export {getFieldUI, getSelectorUI};