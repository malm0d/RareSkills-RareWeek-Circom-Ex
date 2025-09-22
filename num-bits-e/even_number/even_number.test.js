const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("EvenNumber Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("even_number_js")) {
                fs.mkdirSync("even_number_js");
            }
            await execPromise("circom even_number.circom --r1cs --wasm --sym --output even_number_js");
            
            const wasmPath = path.join(__dirname, "even_number_js", "even_number_js", "even_number.wasm");
            const wc = require("./even_number_js/even_number_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept 0 (even number)", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept 2 (even number)", async function () {
        const input = { x: 2 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept 100 (even number)", async function () {
        const input = { x: 100 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept 1000000 (even number)", async function () {
        const input = { x: 1000000 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should reject 1 (odd number)", async function () {
        const input = { x: 1 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject 3 (odd number)", async function () {
        const input = { x: 3 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject 99 (odd number)", async function () {
        const input = { x: 99 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject 1000001 (odd number)", async function () {
        const input = { x: 1000001 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});