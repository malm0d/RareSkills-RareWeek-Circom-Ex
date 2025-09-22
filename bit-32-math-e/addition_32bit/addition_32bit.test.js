const path = require("path");
const fs = require("fs");
const { assert } = require("chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("Addition32Bit Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("addition_32bit_js")) {
                fs.mkdirSync("addition_32bit_js");
            }
            await execPromise("circom addition_32bit.circom --r1cs --wasm --sym --output addition_32bit_js");
            
            const wasmPath = path.join(__dirname, "addition_32bit_js", "addition_32bit_js", "addition_32bit.wasm");
            const wc = require("./addition_32bit_js/addition_32bit_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute 100 + 200 = 300", async function () {
        const input = { x: 100, y: 200 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 300);
    });

    it("Should compute 0 + 0 = 0", async function () {
        const input = { x: 0, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute 1 + 1 = 2", async function () {
        const input = { x: 1, y: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 2);
    });

    it("Should compute large numbers: 1000000 + 2000000 = 3000000", async function () {
        const input = { x: 1000000, y: 2000000 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 3000000);
    });

    it("Should handle overflow: 4294967295 + 1 = 0 (wraps around)", async function () {
        const input = { x: 4294967295, y: 1 }; // 2^32 - 1 + 1 should wrap to 0
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should handle overflow: 4294967290 + 10 = 4 (wraps around)", async function () {
        const input = { x: 4294967290, y: 10 }; // Should wrap around and give 4
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 4);
    });

    it("Should compute 4294967295 + 4294967295 = 4294967294 (overflow)", async function () {
        const input = { x: 4294967295, y: 4294967295 }; // Max + Max
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        // (2^32 - 1) + (2^32 - 1) = 2^33 - 2, which mod 2^32 = 2^32 - 2 = 4294967294
        assert.equal(result, 4294967294);
    });

    it("Should handle mid-range numbers: 2147483647 + 2147483647", async function () {
        const input = { x: 2147483647, y: 2147483647 }; // 2^31 - 1 + 2^31 - 1
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        // This should equal 2^32 - 2, which wraps to 4294967294
        assert.equal(result, 4294967294);
    });
});