const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BitwiseNot Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("bitwise_not_js")) {
                fs.mkdirSync("bitwise_not_js");
            }
            await execPromise("circom bitwise_not.circom --r1cs --wasm --sym --output bitwise_not_js");
            
            const wasmPath = path.join(__dirname, "bitwise_not_js", "bitwise_not_js", "bitwise_not.wasm");
            const wc = require("./bitwise_not_js/bitwise_not_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute NOT 0 = 4294967295 (2^32 - 1)", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 4294967295); // All 32 bits set to 1
    });

    it("Should compute NOT 15 = 4294967280", async function () {
        const input = { x: 15 }; // 1111 -> NOT -> 11111111111111111111111111110000
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 4294967280);
    });

    it("Should compute NOT 255 = 4294967040", async function () {
        const input = { x: 255 }; // 11111111 -> NOT -> 11111111111111111111111100000000
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 4294967040);
    });

    it("Should compute NOT 1 = 4294967294", async function () {
        const input = { x: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 4294967294);
    });

    it("Should compute NOT 4294967295 = 0", async function () {
        const input = { x: 4294967295 }; // All bits set
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });
});