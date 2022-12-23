import { events } from "../event/eventsList.js";
import emitter from "../event/emitter.js";

// Field wrapper that emits certain events
function EmittingField(field) {
    if (!field) {
        throw new Error('Field required');
    }
    this.field = field;

    emitter.emit(events.FIELD_UPDATED, {field: this.field});

    this.setValue = function (index, value, supposed) {
        this.field.setValue(index, value, supposed);
        emitter.emit(events.VALUE_SET, { index, value, supposed });
        emitter.emit(events.FIELD_UPDATED, { field: this.field });
        if (this.field.hasWinCondition()) {
            emitter.emit(events.WIN_CONDITION);
        }
    }

    this.getCell = function (index) {
        return this.field.getCell(index);
    }

    this[Symbol.iterator] = function () {
        return this.field[Symbol.iterator]();
    }
}

export default EmittingField;