const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BitwiseAnd Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("bitwise_and_js")) {
                fs.mkdirSync("bitwise_and_js");
            }
            await execPromise("circom bitwise_and.circom --r1cs --wasm --sym --output bitwise_and_js");
            
            const wasmPath = path.join(__dirname, "bitwise_and_js", "bitwise_and_js", "bitwise_and.wasm");
            const wc = require("./bitwise_and_js/bitwise_and_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute 15 & 7 = 7", async function () {
        const input = { x: 15, y: 7 }; // 1111 & 0111 = 0111
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 7);
    });

    it("Should compute 255 & 170 = 170", async function () {
        const input = { x: 255, y: 170 }; // 11111111 & 10101010 = 10101010
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 170);
    });

    it("Should compute 0 & anything = 0", async function () {
        const input = { x: 0, y: 12345 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute 123 & 0 = 0", async function () {
        const input = { x: 123, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute 1000000 & 1000000 = 1000000", async function () {
        const input = { x: 1000000, y: 1000000 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 1000000);
    });
});