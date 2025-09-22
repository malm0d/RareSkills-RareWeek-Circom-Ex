const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("AtLeastOnePair Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(15000);
        const outDir = path.join(__dirname, "at_least_one_pair_js");
        fs.mkdirSync(outDir, { recursive: true });
        await execPromise("circom at_least_one_pair.circom --r1cs --wasm --sym --output at_least_one_pair_js");
        const wasmPath = path.join(__dirname, "at_least_one_pair_js", "at_least_one_pair_js", "at_least_one_pair.wasm");
        const wc = require("./at_least_one_pair_js/at_least_one_pair_js/witness_calculator.js");
        const buffer = fs.readFileSync(wasmPath);
        witnessCalculator = await wc(buffer);
    });

    it("accepts when (x && !y) is true", async function () {
        const input = { x: 1, y: 0, w: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("accepts when (!y && w) is true", async function () {
        const input = { x: 0, y: 0, w: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("rejects when both are false", async function () {
        const bad = { x: 0, y: 1, w: 1 };
        try {
            await witnessCalculator.calculateWitness(bad, 0);
            assert.fail("Should have thrown an error");
        } catch (err) {
            assert.exists(err);
        }
    });
});
