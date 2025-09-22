const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("OpenClosedIntervals Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("open_closed_intervals_js")) {
                fs.mkdirSync("open_closed_intervals_js");
            }
            await execPromise("circom open_closed_intervals.circom --r1cs --wasm --sym --output open_closed_intervals_js");
            
            const wasmPath = path.join(__dirname, "open_closed_intervals_js", "open_closed_intervals_js", "open_closed_intervals.wasm");
            const wc = require("./open_closed_intervals_js/open_closed_intervals_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    // Test valid combinations: x in [10, 15) and y in (15, 30)
    it("Should accept x = 10, y = 16 (x at lower bound, y just above 15)", async function () {
        const input = { x: 10, y: 16 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 14, y = 29 (x just below 15, y just below 30)", async function () {
        const input = { x: 14, y: 29 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 12, y = 20 (middle values)", async function () {
        const input = { x: 12, y: 20 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 13, y = 25 (valid combination)", async function () {
        const input = { x: 13, y: 25 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test invalid x values (outside [10, 15))
    it("Should reject x = 9, y = 20 (x below interval)", async function () {
        const input = { x: 9, y: 20 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=9, y=20 (invalid input)");
    });

    it("Should reject x = 15, y = 20 (x at excluded upper bound)", async function () {
        const input = { x: 15, y: 20 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=15, y=20 (invalid input)");
    });

    it("Should reject x = 16, y = 20 (x above interval)", async function () {
        const input = { x: 16, y: 20 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=16, y=20 (invalid input)");
    });

    // Test invalid y values (outside (15, 30))
    it("Should reject x = 12, y = 15 (y at excluded lower bound)", async function () {
        const input = { x: 12, y: 15 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=12, y=15 (invalid input)");
    });

    it("Should reject x = 12, y = 14 (y below interval)", async function () {
        const input = { x: 12, y: 14 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=12, y=14 (invalid input)");
    });

    it("Should reject x = 12, y = 30 (y at excluded upper bound)", async function () {
        const input = { x: 12, y: 30 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=12, y=30 (invalid input)");
    });

    it("Should reject x = 12, y = 31 (y above interval)", async function () {
        const input = { x: 12, y: 31 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=12, y=31 (invalid input)");
    });

    // Test invalid combinations (both out of range)
    it("Should reject x = 9, y = 14 (both outside intervals)", async function () {
        const input = { x: 9, y: 14 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=9, y=14 (invalid input)");
    });

    // Test additional invalid values for comprehensive coverage
    it("Should reject x = 8, y = 25 (x below interval)", async function () {
        const input = { x: 8, y: 25 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=8, y=25 (invalid input)");
    });

    it("Should reject x = 11, y = 10 (y below interval)", async function () {
        const input = { x: 11, y: 10 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=11, y=10 (invalid input)");
    });
});