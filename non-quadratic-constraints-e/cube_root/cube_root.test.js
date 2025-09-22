const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("CubeRoot Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(15000);
        const outDir = path.join(__dirname, "cube_root_js");
        fs.mkdirSync(outDir, { recursive: true });
        await execPromise("circom cube_root.circom --r1cs --wasm --sym --output cube_root_js");
        const wasmPath = path.join(__dirname, "cube_root_js", "cube_root_js", "cube_root.wasm");
        const wc = require("./cube_root_js/cube_root_js/witness_calculator.js");
        const buffer = fs.readFileSync(wasmPath);
        witnessCalculator = await wc(buffer);
    });

    const validCases = [
        { x: 0, expected_z: 0 },   // 0^3 = 0
        { x: 1, expected_z: 1 },   // 1^3 = 1
        { x: 2, expected_z: 8 },   // 2^3 = 8
        { x: 3, expected_z: 27 },  // 3^3 = 27
        { x: 4, expected_z: 64 },  // 4^3 = 64
        { x: 5, expected_z: 125 }, // 5^3 = 125
    ];

    it("accepts correct cube relationships", async function () {
        for (const testCase of validCases) {
            const input = { x: testCase.x, z: testCase.expected_z };
            const witness = await witnessCalculator.calculateWitness(input, 0);
            assert.exists(witness, `Should accept valid case: x=${testCase.x}, z=${testCase.expected_z}`);
        }
    });

    it("rejects incorrect cube relationships", async function () {
        for (const testCase of validCases) {
            // Test multiple incorrect z values for each x
            const incorrectZValues = [
                testCase.expected_z + 1,
                testCase.expected_z - 1,
                testCase.expected_z + 10,
                testCase.expected_z + 5,
            ];
            
            for (const incorrect_z of incorrectZValues) {
                if (incorrect_z < 0 || incorrect_z === testCase.expected_z) continue; // Skip negative values and correct values
                
                const badInput = { x: testCase.x, z: incorrect_z };
                let witnessGenerated = false;
                
                try {
                    await witnessCalculator.calculateWitness(badInput, 0);
                    witnessGenerated = true;
                } catch (err) {
                    // Good - this should throw an error
                }
                
                assert.isFalse(witnessGenerated, `Should have rejected invalid case: x=${testCase.x}, z=${incorrect_z} (correct z should be ${testCase.expected_z}) but witness was generated successfully`);
            }
        }
    });
});
