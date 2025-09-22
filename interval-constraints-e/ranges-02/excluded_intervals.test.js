const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("ExcludedIntervals Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("excluded_intervals_js")) {
                fs.mkdirSync("excluded_intervals_js");
            }
            await execPromise("circom excluded_intervals.circom --r1cs --wasm --sym --output excluded_intervals_js");
            
            const wasmPath = path.join(__dirname, "excluded_intervals_js", "excluded_intervals_js", "excluded_intervals.wasm");
            const wc = require("./excluded_intervals_js/excluded_intervals_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    // Test valid values (not in excluded intervals)
    it("Should accept x = -1 (below first excluded interval)", async function () {
        const input = { x: -1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 21 (between excluded intervals)", async function () {
        const input = { x: 21 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 22 (between excluded intervals)", async function () {
        const input = { x: 22 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 23 (between excluded intervals)", async function () {
        const input = { x: 23 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 24 (between excluded intervals)", async function () {
        const input = { x: 24 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 100 (above second excluded interval)", async function () {
        const input = { x: 100 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 150 (well above excluded intervals)", async function () {
        const input = { x: 150 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test invalid values (in excluded intervals [0, 20] and [25, 100)) - these should FAIL witness generation
    it("Should reject x = 0 (in first excluded interval)", async function () {
        const input = { x: 0 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=0 (invalid input)");
    });

    it("Should reject x = 10 (in first excluded interval)", async function () {
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

    it("Should reject x = 20 (in first excluded interval)", async function () {
        const input = { x: 20 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=20 (invalid input)");
    });

    it("Should reject x = 25 (in second excluded interval)", async function () {
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

    it("Should reject x = 50 (in second excluded interval)", async function () {
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

    it("Should reject x = 99 (in second excluded interval)", async function () {
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

    // Test additional invalid values for comprehensive coverage
    it("Should reject x = 5 (in first excluded interval)", async function () {
        const input = { x: 5 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=5 (invalid input)");
    });

    it("Should reject x = 75 (in second excluded interval)", async function () {
        const input = { x: 75 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=75 (invalid input)");
    });
});