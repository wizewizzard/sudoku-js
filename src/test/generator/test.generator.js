import Generator from "../../main/generator/generator.js";

describe("Generator", function() {

    const generator = new Generator();

    it("Generates field array with given strategy", function() {
        chai.assert.equal(generator.generateFilledFieldArray().length, 81);
    });
  
    it("Generates field with given strategy", function() {
        chai.assert.equal(generator.createFieldOfNumberOfCells().length, 81);
    });
});