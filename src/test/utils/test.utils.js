import {getRow, getColumn, getQuadrant, getRepeats, hasRepeats, getRandomGeneratorFromArray}  from '../../main/utils/utils.js';

describe("utils test", function(){
    const field = [
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

    describe("Extracting row", function(){
        it("Should extract the first row", function(){
            chai.expect(getRow(field, 0)).to.eql([2, 1, 9, 5, 4, 3, 6, 7, 8])
        }),
        it("Should extract the last row", function(){
            chai.expect(getRow(field, 8)).to.eql([9, 8, 7, 3, 2, 1, 4, 5, 6])
        }),
        it("Should extract the third row", function(){
            chai.expect(getRow(field, 2)).to.eql([8, 7, 6, 2, 1, 9, 3, 4, 5])
        })
    });

    describe("Extracting columns", function(){
        it("Should extract the first column", function(){
            chai.expect(getColumn(field, 0)).to.eql([2, 5, 8, 4, 7, 1, 3, 6, 9])
        }),
        it("Should extract the third column", function(){
            chai.expect(getColumn(field, 2)).to.eql([9, 3, 6, 2, 5, 8, 1, 4, 7])
        }),
        it("Should extract the last column", function(){
            chai.expect(getColumn(field, 8)).to.eql([8, 2, 5, 1, 4, 7, 9, 3, 6])
        })
    });

    describe("Extracting qudrant", function(){
        it("Should extract the first qudrant", function(){
            chai.expect(getQuadrant(field, 0)).to.eql([2, 1, 9, 5, 4, 3, 8, 7, 6])
        }),
        it("Should extract the third qudrant", function(){
            chai.expect(getQuadrant(field, 2)).to.eql([6, 7, 8, 9, 1, 2, 3, 4, 5])
        }),
        it("Should extract the last qudrant", function(){
            chai.expect(getQuadrant(field, 8)).to.eql([7, 8, 9, 1, 2, 3, 4, 5, 6])
        })
    });

    describe("Has repeats", function(){
        it("Should not find any repeats", function(){
            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            chai.assert.isFalse(hasRepeats(arr));
        });
        it("Should not find any repeats", function(){
            const arr = [1, null, null, null, 2, null, 9];
            chai.assert.isFalse(hasRepeats(arr));
        });
        it("Should not find any repeats", function(){
            const arr = [1, null, null, null, 2, null, 9];
            chai.assert.isFalse(hasRepeats(arr));
        });
    });

    describe("Find repeats", function(){
        it("Should not find any repeats", function(){
            const arr = [1, 2, 3, 6, 4, 5];
            chai.expect(getRepeats(arr)).to.eql([]);
        });
        it("Should say there are some repeats", function(){
            const arr = [1, 2, 3, 6, 6, 5];
            chai.assert.isTrue(hasRepeats(arr));
        });
        it("Should find repeats in mostly nulled array", function(){
            const arr = [1, 1, null, null, null, 5];
            const result = getRepeats(arr);
            chai.expect(result.map(r => r.value)).to.have.members([1]);
            chai.expect(result.map(r => r.pos)[0]).to.have.members([0, 1]);
        });
        it("Should find couple repeats", function(){
            const arr = [1, 2, 3, 6, 4, 6, 3, 5];
            const result = getRepeats(arr);
            chai.expect(result.map(r => r.value)).to.have.members([3, 6]);
            chai.expect(result.map(r => r.pos)[0]).to.have.members([2, 6]);
            chai.expect(result.map(r => r.pos)[1]).to.have.members([3, 5]);
        });
        it("Should find couple repeats in array with null values", function(){
            const arr = [null, null, null, null, 3, null, 3, 6, null, 5, 6];
            const result = getRepeats(arr);
            chai.expect(result.map(r => r.value)).to.have.members([3, 6]);
            chai.expect(result.map(r => r.pos)[0]).to.have.members([4, 6]);
            chai.expect(result.map(r => r.pos)[1]).to.have.members([7, 10]);
        });
        it("Should find one repeat", function(){
            const arr = [1, 1, 1, 1, 1];
            const result = getRepeats(arr);
            chai.expect(result.map(r => r.value)).to.eql([1]);
            chai.expect(result.map(r => r.pos)[0]).to.have.members([0, 1, 2, 3, 4]);
        });
        it("Should work correctly on empty array", function(){
            const arr = [];
            chai.expect(getRepeats(arr)).to.eql([]);
        });
        it("Should not find any repeats in null valued array", function(){
            const arr = [null, null, null];
            const result = getRepeats(arr);
            chai.expect(result.map(r => r.value)).to.eql([]);
        });
    });

    describe("Generator", function(){
        it("Should generate same values but in random order", function(){
            const baseValues = [1, 2, 3, 4, 5, 6];
            const randomValuesFromArray = [...getRandomGeneratorFromArray(baseValues)];
            chai.expect(randomValuesFromArray).to.have.members(baseValues);
        });
        
    });
})