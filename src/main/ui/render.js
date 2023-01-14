function getFieldUI(fieldElement) {
    return {
        render(field) {
            if (!field) {
                console.error("No field to render");
                return;
            }
            let i = 0;
            for (const cell of field) {
                const cellElement = fieldElement.querySelector(`.cell[data-index="${i}"]`)
                const supposedValuesDiv = cellElement.querySelector('.supposedValues');
                if (cell.getValue() != null) {
                    if (!cell.isModifiable()) {
                        cellElement.classList.add("unmodifiable");
                    }
                    else {
                        cellElement.classList.remove("unmodifiable");
                    }
                    supposedValuesDiv.classList.add('hidden');
                    cellElement.querySelector('.value').textContent = cell.getValue();
                }
                else {
                    cellElement.querySelector('.value').textContent = '';
                    if (cell.getSupposedValues() && cell.getSupposedValues().length > 0) {
                        supposedValuesDiv.classList.remove('hidden');                      
                        supposedValuesDiv.innerHTML = '';
                        cell.getSupposedValues().forEach(v => {
                            const numberContrainer = document.createElement('div');
                            numberContrainer.textContent = v;
                            supposedValuesDiv.append(numberContrainer);
                        })
                        
                    }
                    else {
                        supposedValuesDiv.classList.add('hidden');
                    }
                }
                i++;
            }
        },
        clear() {
            // TODO: implement
        }
    }
}

function getSelectorUI(selectorElement) {
    return {
        render(selector, { x, y, index, supposed }) {
            if (!selector || selector.isDisabled()) {
                console.error("Unable to render the selector. The selector is not initialized or it is disabled");
                return;
            }
            selectorElement.querySelectorAll('.cell').forEach(element => {
                if (selector.isValueAlreadySelected(index, Number(element.dataset.number), supposed)) {
                    element.classList.add('selected');
                }
                else {
                    element.classList.remove('selected');
                }
            });
            if (x && y) {
                selectorElement.style.left = x + "px";
                selectorElement.style.top = y + "px";
                selectorElement.classList.remove('hidden');
            }
        },
        hide() {
            selectorElement.classList.add('hidden');
        }
    };
}

function getTimerUI(timerElement) {
    return {
        render(ms) {
            timerElement.textContent = formatMsForTimer(ms);
        },
        zero() {
            timerElement.textContent = '00:00:00';
        }
    }
}

function asHMSMs (millis) {
    let intermedValue = millis;
    const ms = intermedValue % 1000;
    intermedValue = Math.round((intermedValue - ms) / 1000);
    const s = intermedValue % 60;
    intermedValue = Math.round((intermedValue - s) / 60);
    const m = Math.round(intermedValue % 60);
    const h = Math.round((intermedValue - m) / 60);
    return { h, m, s, ms };
}

function formatMsForTimer(ms){
    const { h, m, s} = asHMSMs(ms);
    return `${digitPadding(h)}:${digitPadding(m)}:${digitPadding(s)}`;
}

function digitPadding(n, z = 2) {
    return ('00' + n).slice(-z);
}

export { getFieldUI, getSelectorUI, getTimerUI, formatMsForTimer };