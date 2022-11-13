import Generator from "../../main/generator/generator.js";

describe("Generator", function() {

    const generator = new Generator();

    it("Generates field array", function() {
        chai.assert.equal(generator.generateFilledFieldArray().length, 81);
    });
  
    it("Generates field object with 10 values", function() {
        const generatedField = generator.createFieldOfNumberOfCells(10);
        let valuesCount = 0;
        for(const val of generatedField){
            if(val !== null) valuesCount ++;
        }
        chai.assert.equal(generatedField.length, 81);
        chai.assert.equal(valuesCount, 10);

    });

    it("Generates field object with 81 values", function() {
        const generatedField = generator.createFieldOfNumberOfCells(81);
        let valuesCount = 0;
        for(const val of generatedField){
            if(val !== null) valuesCount ++;
        }
        chai.assert.equal(generatedField.length, 81);
        chai.assert.equal(valuesCount, 81);

    });

    it("Generates field object with 0 values", function() {
        const generatedField = generator.createFieldOfNumberOfCells(0);
        let valuesCount = 0;
        for(const val of generatedField){
            if(val !== null) valuesCount ++;
        }
        chai.assert.equal(generatedField.length, 81);
        chai.assert.equal(valuesCount, 0);

    });
});