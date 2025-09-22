const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("AndThreeBool Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(15000);
        const outDir = path.join(__dirname, "and_three_bool_js");
        fs.mkdirSync(outDir, { recursive: true });
        await execPromise("circom and_three_bool.circom --r1cs --wasm --sym --output and_three_bool_js");
        const wasmPath = path.join(__dirname, "and_three_bool_js", "and_three_bool_js", "and_three_bool.wasm");
        const wc = require("./and_three_bool_js/and_three_bool_js/witness_calculator.js");
        const buffer = fs.readFileSync(wasmPath);
        witnessCalculator = await wc(buffer);
    });

    const truthTable = [
        { x: 0, y: 0, u: 0, expected_z: 0 },
        { x: 0, y: 0, u: 1, expected_z: 0 },
        { x: 0, y: 1, u: 0, expected_z: 0 },
        { x: 0, y: 1, u: 1, expected_z: 0 },
        { x: 1, y: 0, u: 0, expected_z: 0 },
        { x: 1, y: 0, u: 1, expected_z: 0 },
        { x: 1, y: 1, u: 0, expected_z: 0 },
        { x: 1, y: 1, u: 1, expected_z: 1 }
    ];

    it("accepts correct AND logic for all input combinations", async function () {
        for (const testCase of truthTable) {
            const input = { 
                x: testCase.x, 
                y: testCase.y, 
                u: testCase.u, 
                z: testCase.expected_z 
            };
            const witness = await witnessCalculator.calculateWitness(input, 0);
            assert.exists(witness, `Should accept valid case: ${JSON.stringify(input)}`);
        }
    });

    it("rejects incorrect z values", async function () {
        for (const testCase of truthTable) {
            const incorrect_z = 1 - testCase.expected_z; // flip the expected result
            const badInput = { 
                x: testCase.x, 
                y: testCase.y, 
                u: testCase.u, 
                z: incorrect_z 
            };
            
            let witnessGenerated = false;
            try {
                await witnessCalculator.calculateWitness(badInput, 0);
                witnessGenerated = true;
            } catch (err) {
                // Good - this should throw an error
            }
            
            assert.isFalse(witnessGenerated, `Should have rejected invalid case: ${JSON.stringify(badInput)} but witness was generated successfully`);
        }
    });

    it("rejects non-boolean inputs", async function () {
        const nonBooleanCases = [
            { x: 2, y: 1, u: 1, z: 1 },   // x is not boolean
            { x: 1, y: 2, u: 1, z: 1 },   // y is not boolean  
            { x: 1, y: 1, u: 2, z: 1 },   // u is not boolean (will be caught by AND constraint)
            { x: 1, y: 1, u: 1, z: 2 },   // z is not boolean
            { x: 3, y: 1, u: 1, z: 1 },   // x is not boolean
            { x: 1, y: 3, u: 1, z: 1 },   // y is not boolean
            { x: 1, y: 1, u: 3, z: 1 },   // u is not boolean (will be caught by AND constraint)
            { x: 1, y: 1, u: 1, z: 3 },   // z is not boolean
            { x: 0, y: 0, u: 5, z: 0 },   // u is not boolean (should be caught by missing u constraint)
            { x: 0, y: 1, u: 7, z: 0 },   // u is not boolean (should be caught by missing u constraint) 
            { x: 1, y: 0, u: 9, z: 0 }    // u is not boolean (should be caught by missing u constraint)
        ];

        for (const badInput of nonBooleanCases) {
            let witnessGenerated = false;
            try {
                await witnessCalculator.calculateWitness(badInput, 0);
                witnessGenerated = true;
            } catch (err) {
                // Good - this should throw an error
            }
            
            assert.isFalse(witnessGenerated, `Should have rejected non-boolean input: ${JSON.stringify(badInput)} but witness was generated successfully`);
        }
    });
});
