const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("MultipleIntervals Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("multiple_intervals_js")) {
                fs.mkdirSync("multiple_intervals_js");
            }
            await execPromise("circom multiple_intervals.circom --r1cs --wasm --sym --output multiple_intervals_js");
            
            const wasmPath = path.join(__dirname, "multiple_intervals_js", "multiple_intervals_js", "multiple_intervals.wasm");
            const wc = require("./multiple_intervals_js/multiple_intervals_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    // Test valid values in first interval [10, 20]
    it("Should accept x = 10 (first interval lower bound)", async function () {
        const input = { x: 10 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 20 (first interval upper bound)", async function () {
        const input = { x: 20 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 15 (middle of first interval)", async function () {
        const input = { x: 15 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test valid values in second interval [40, 80]
    it("Should accept x = 40 (second interval lower bound)", async function () {
        const input = { x: 40 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 80 (second interval upper bound)", async function () {
        const input = { x: 80 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 60 (middle of second interval)", async function () {
        const input = { x: 60 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test valid values in third interval [100, 200]
    it("Should accept x = 100 (third interval lower bound)", async function () {
        const input = { x: 100 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 200 (third interval upper bound)", async function () {
        const input = { x: 200 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 150 (middle of third interval)", async function () {
        const input = { x: 150 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test invalid values (gaps between intervals)
    it("Should reject x = 9 (below all intervals)", async function () {
        const input = { x: 9 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=9 (invalid input)");
    });

    it("Should reject x = 25 (between first and second interval)", async function () {
        const input = { x: 25 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=25 (invalid input)");
    });

    it("Should reject x = 39 (just before second interval)", async function () {
        const input = { x: 39 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=39 (invalid input)");
    });

    it("Should reject x = 90 (between second and third interval)", async function () {
        const input = { x: 90 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=90 (invalid input)");
    });

    it("Should reject x = 99 (just before third interval)", async function () {
        const input = { x: 99 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=99 (invalid input)");
    });

    it("Should reject x = 201 (above all intervals)", async function () {
        const input = { x: 201 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=201 (invalid input)");
    });

    // Test additional invalid values for comprehensive coverage
    it("Should reject x = 35 (between intervals)", async function () {
        const input = { x: 35 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=35 (invalid input)");
    });

    it("Should reject x = 81 (between intervals)", async function () {
        const input = { x: 81 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=81 (invalid input)");
    });
});