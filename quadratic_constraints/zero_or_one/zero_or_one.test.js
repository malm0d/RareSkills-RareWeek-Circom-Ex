const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("ZeroOrOne Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("zero_or_one_js")) {
                fs.mkdirSync("zero_or_one_js");
            }
            await execPromise("circom zero_or_one.circom --r1cs --wasm --sym --output zero_or_one_js");
            
            const wasmPath = path.join(__dirname, "zero_or_one_js", "zero_or_one_js", "zero_or_one.wasm");
            const wc = require("./zero_or_one_js/zero_or_one_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept x=0", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=1", async function () {
        const input = { x: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
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

    it("Should reject x=0.5", async function () {
        const input = { x: 0.5 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=10", async function () {
        const input = { x: 10 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});