import Field from "../../main/field/field.js";

const fieldArrayConsistent = [
    2, 1, 9, 5, 4, 3, 6, 7, 8,
    5, 4, 3, 8, 7, 6, 9, 1, 2,
    8, 7, 6, 2, 1, 9, 3, 4, 5,
    4, 3, 2, 7, 6, 5, 8, 9, 1,
    7, 6, 5, 1, 9, 8, 2, 3, 4,
    1, 9, 8, 4, 3, 2, 5, 6, 7,
    3, 2, 1, 6, 5, 4, 7, 8, 9,
    6, 5, 4, 9, 8, 7, 1, 2, 3,
    9, 8, 7, 3, 2, 1, 4, 5, 6
];

const fieldArrayInconsistent = [
    2, 1, 9, 5, 3, 3, 6, 7, 8,
    5, 4, 3, 8, 7, 6, 9, 1, 2,
    8, 7, 6, 2, 1, 9, 3, 4, 5,
    4, 3, 2, 7, 6, 5, 8, 9, 1,
    7, 6, 5, 1, 9, 8, 2, 3, 4,
    1, 9, 8, 4, 3, 2, 5, 6, 7,
    3, 2, 1, 6, 5, 4, 7, 8, 9,
    6, 5, 4, 9, 8, 7, 1, 2, 3,
    9, 8, 7, 3, 2, 1, 4, 5, 6
];

describe("field", function() {

    it("Should not find any repeats and inconsistency", function() {
        const field = new Field(fieldArrayConsistent);
        chai.assert.isTrue(field.isConsistent());
    });

    it("Should report that field is not consistent because of repeats in row 0, column 4", function() {
        const field = new Field(fieldArrayInconsistent);
        chai.assert.isFalse(field.isConsistent());
    });
  
});