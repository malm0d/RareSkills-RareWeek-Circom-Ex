const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("SixteenOrTwentyOrTwentyfour Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(15000);
        const outDir = path.join(__dirname, "sixteen_or_twenty_or_twentyfour_js");
        fs.mkdirSync(outDir, { recursive: true });
        await execPromise("circom sixteen_or_twenty_or_twentyfour.circom --r1cs --wasm --sym --output sixteen_or_twenty_or_twentyfour_js");
        const wasmPath = path.join(__dirname, "sixteen_or_twenty_or_twentyfour_js", "sixteen_or_twenty_or_twentyfour_js", "sixteen_or_twenty_or_twentyfour.wasm");
        const wc = require("./sixteen_or_twenty_or_twentyfour_js/sixteen_or_twenty_or_twentyfour_js/witness_calculator.js");
        const buffer = fs.readFileSync(wasmPath);
        witnessCalculator = await wc(buffer);
    });

    const validValues = [16, 20, 24];
    
    it("accepts all valid values (16, 20, 24)", async function () {
        for (const validValue of validValues) {
            const input = { x: validValue };
            const witness = await witnessCalculator.calculateWitness(input, 0);
            assert.exists(witness, `Should accept valid value x=${validValue}`);
        }
    });

    it("rejects invalid values comprehensively", async function () {
        // Test values around the valid ones and some edge cases
        const invalidValues = [
            // Around 16
            0, 1, 14, 15, 17, 18,
            // Around 20  
            19, 21, 22,
            // Around 24
            23, 25, 26,
            // Edge cases
            -1, -16, -20, -24, 30, 50, 100
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
