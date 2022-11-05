import generateField from "../../main/generator/generator.js";

describe("generator", function() {

    it("Generates field with given strategy", function() {
        chai.assert.equal(generateField(), 2);
    });
  
});