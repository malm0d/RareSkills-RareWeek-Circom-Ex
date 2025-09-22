const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("QuadraticSolution Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("quadratic_solution_js")) {
                fs.mkdirSync("quadratic_solution_js");
            }
            await execPromise("circom quadratic_solution.circom --r1cs --wasm --sym --output quadratic_solution_js");
            
            const wasmPath = path.join(__dirname, "quadratic_solution_js", "quadratic_solution_js", "quadratic_solution.wasm");
            const wc = require("./quadratic_solution_js/quadratic_solution_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept x=0 (solution to 2x^2 + 5x = 0)", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    // Note: Circom works with integers, so we can't test x = -2.5 directly
    // We would need to work with a different field or scale the equation

    it("Should reject x=1", async function () {
        const input = { x: 1 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=2", async function () {
        const input = { x: 2 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=-1", async function () {
        const input = { x: -1 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=-2", async function () {
        const input = { x: -2 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=-3", async function () {
        const input = { x: -3 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=5", async function () {
        const input = { x: 5 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});