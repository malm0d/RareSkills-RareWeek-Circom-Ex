const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("TwelveOrFifteen Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("twelve_or_fifteen_js")) {
                fs.mkdirSync("twelve_or_fifteen_js");
            }
            await execPromise("circom twelve_or_fifteen.circom --r1cs --wasm --sym --output twelve_or_fifteen_js");
            
            const wasmPath = path.join(__dirname, "twelve_or_fifteen_js", "twelve_or_fifteen_js", "twelve_or_fifteen.wasm");
            const wc = require("./twelve_or_fifteen_js/twelve_or_fifteen_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept x=12", async function () {
        const input = { x: 12 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=15", async function () {
        const input = { x: 15 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should reject x=0", async function () {
        const input = { x: 0 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=1", async function () {
        const input = { x: 1 };
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

    it("Should reject x=13", async function () {
        const input = { x: 13 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject x=20", async function () {
        const input = { x: 20 };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});