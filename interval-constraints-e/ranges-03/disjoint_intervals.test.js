const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("DisjointIntervals Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("disjoint_intervals_js")) {
                fs.mkdirSync("disjoint_intervals_js");
            }
            await execPromise("circom disjoint_intervals.circom --r1cs --wasm --sym --output disjoint_intervals_js");
            
            const wasmPath = path.join(__dirname, "disjoint_intervals_js", "disjoint_intervals_js", "disjoint_intervals.wasm");
            const wc = require("./disjoint_intervals_js/disjoint_intervals_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    // Test valid values in [0, 5]
    it("Should accept x = 0 (first interval lower bound)", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 5 (first interval upper bound)", async function () {
        const input = { x: 5 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 3 (middle of first interval)", async function () {
        const input = { x: 3 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test valid values in [20, 40]
    it("Should accept x = 20 (second interval lower bound)", async function () {
        const input = { x: 20 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 40 (second interval upper bound)", async function () {
        const input = { x: 40 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 30 (middle of second interval)", async function () {
        const input = { x: 30 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test invalid values (gaps between intervals) - these should FAIL witness generation
    it("Should reject x = 6 (gap between intervals)", async function () {
        const input = { x: 6 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=6 (invalid input)");
    });

    it("Should reject x = 19 (gap between intervals)", async function () {
        const input = { x: 19 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=19 (invalid input)");
    });

    it("Should reject x = 41 (above both intervals)", async function () {
        const input = { x: 41 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=41 (invalid input)");
    });

    it("Should reject x = -1 (below both intervals)", async function () {
        const input = { x: -1 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=-1 (invalid input)");
    });

    // Test more invalid values to ensure comprehensive constraint checking
    it("Should reject x = 10 (middle of gap)", async function () {
        const input = { x: 10 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=10 (invalid input)");
    });

    it("Should reject x = 15 (middle of gap)", async function () {
        const input = { x: 15 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=15 (invalid input)");
    });

    it("Should reject x = 50 (far above intervals)", async function () {
        const input = { x: 50 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=50 (invalid input)");
    });

    it("Should reject x = -10 (far below intervals)", async function () {
        const input = { x: -10 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=-10 (invalid input)");
    });
});