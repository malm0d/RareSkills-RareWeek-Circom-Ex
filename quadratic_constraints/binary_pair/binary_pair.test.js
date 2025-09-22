const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BinaryPair Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("binary_pair_js")) {
                fs.mkdirSync("binary_pair_js");
            }
            await execPromise("circom binary_pair.circom --r1cs --wasm --sym --output binary_pair_js");
            
            const wasmPath = path.join(__dirname, "binary_pair_js", "binary_pair_js", "binary_pair.wasm");
            const wc = require("./binary_pair_js/binary_pair_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept x=0, y=0", async function () {
        const input = { x: 0, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=0, y=1", async function () {
        const input = { x: 0, y: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=1, y=0", async function () {
        const input = { x: 1, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=1, y=1", async function () {
        const input = { x: 1, y: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should reject x=2, y=0", async function () {
        const input = { x: 2, y: 0 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=0, y=2", async function () {
        const input = { x: 0, y: 2 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=3, y=4", async function () {
        const input = { x: 3, y: 4 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=-1, y=1", async function () {
        const input = { x: -1, y: 1 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});