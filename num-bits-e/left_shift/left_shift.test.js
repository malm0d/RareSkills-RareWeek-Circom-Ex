const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("LeftShift Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("left_shift_js")) {
                fs.mkdirSync("left_shift_js");
            }
            await execPromise("circom left_shift.circom --r1cs --wasm --sym --output left_shift_js");
            
            const wasmPath = path.join(__dirname, "left_shift_js", "left_shift_js", "left_shift.wasm");
            const wc = require("./left_shift_js/left_shift_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute 1 << 4 = 16", async function () {
        const input = { x: 1 }; // 1 shifted left by 4 = 16
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 16);
    });

    it("Should compute 15 << 4 = 240", async function () {
        const input = { x: 15 }; // 1111 << 4 = 11110000 = 240
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 240);
    });

    it("Should compute 0 << 4 = 0", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute 123 << 4 = 1968", async function () {
        const input = { x: 123 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 123 << 4);
    });

    it("Should handle overflow: 268435455 << 4 truncates", async function () {
        const input = { x: 268435455 }; // Large number that will overflow when shifted
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        // Should truncate to 32 bits - JavaScript handles this automatically with >>> 0
        const expected = (268435455 << 4) >>> 0; // Force to unsigned 32-bit
        assert.equal(result, expected);
    });
});