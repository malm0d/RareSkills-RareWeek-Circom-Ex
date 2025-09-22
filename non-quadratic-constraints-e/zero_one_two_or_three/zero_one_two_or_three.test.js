const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("ZeroOneTwoOrThree Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(15000);
        const outDir = path.join(__dirname, "zero_one_two_or_three_js");
        fs.mkdirSync(outDir, { recursive: true });
        await execPromise("circom zero_one_two_or_three.circom --r1cs --wasm --sym --output zero_one_two_or_three_js");
        const wasmPath = path.join(__dirname, "zero_one_two_or_three_js", "zero_one_two_or_three_js", "zero_one_two_or_three.wasm");
        const wc = require("./zero_one_two_or_three_js/zero_one_two_or_three_js/witness_calculator.js");
        const buffer = fs.readFileSync(wasmPath);
        witnessCalculator = await wc(buffer);
    });

    const validValues = [0, 1, 2, 3];
    
    it("accepts all valid values (0, 1, 2, 3)", async function () {
        for (const validValue of validValues) {
            const input = { x: validValue };
            const witness = await witnessCalculator.calculateWitness(input, 0);
            assert.exists(witness, `Should accept valid value x=${validValue}`);
        }
    });

    it("rejects invalid values comprehensively", async function () {
        // Test values around the valid ones and edge cases
        const invalidValues = [
            // Negative values
            -3, -2, -1,
            // Values around valid range
            4, 5, 6, 7, 8, 9, 10,
            // Larger values
            15, 20, 50, 100, 
            // Edge cases that might expose vulnerabilities
            -10, 11, 12, 25
        ];
        
        for (const invalidValue of invalidValues) {
            const input = { x: invalidValue };
            let witnessGenerated = false;
            
            try {
                await witnessCalculator.calculateWitness(input, 0);
                witnessGenerated = true;
            } catch (err) {
                // Good - this should throw an error
            }
            
            assert.isFalse(witnessGenerated, `Should have rejected invalid value x=${invalidValue} but witness was generated successfully`);
        }
    });
});
