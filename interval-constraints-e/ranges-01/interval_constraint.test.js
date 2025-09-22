const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("IntervalConstraint Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("interval_constraint_js")) {
                fs.mkdirSync("interval_constraint_js");
            }
            await execPromise("circom interval_constraint.circom --r1cs --wasm --sym --output interval_constraint_js");
            
            const wasmPath = path.join(__dirname, "interval_constraint_js", "interval_constraint_js", "interval_constraint.wasm");
            const wc = require("./interval_constraint_js/interval_constraint_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    // Test valid values in the interval [0, 5]
    it("Should accept x = 0 (lower bound)", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 5 (upper bound)", async function () {
        const input = { x: 5 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 3 (middle value)", async function () {
        const input = { x: 3 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 1", async function () {
        const input = { x: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x = 4", async function () {
        const input = { x: 4 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Test invalid values outside the interval [0, 5]
    it("Should reject x = -1 (below lower bound)", async function () {
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

    it("Should reject x = 6 (above upper bound)", async function () {
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

    it("Should reject x = 10 (well above upper bound)", async function () {
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

    it("Should reject x = -5 (well below lower bound)", async function () {
        const input = { x: -5 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=-5 (invalid input)");
    });

    // Test additional invalid values for comprehensive coverage
    it("Should reject x = 7 (above upper bound)", async function () {
        const input = { x: 7 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=7 (invalid input)");
    });

    it("Should reject x = -2 (below lower bound)", async function () {
        const input = { x: -2 };
        let witnessGenerated = false;
        try {
            await witnessCalculator.calculateWitness(input, 0);
            witnessGenerated = true;
        } catch (error) {
            // Expected to throw an error
        }
        assert.isFalse(witnessGenerated, "Witness should not be generated for x=-2 (invalid input)");
    });
});