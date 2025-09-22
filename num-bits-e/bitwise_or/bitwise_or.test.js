const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BitwiseOr Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("bitwise_or_js")) {
                fs.mkdirSync("bitwise_or_js");
            }
            await execPromise("circom bitwise_or.circom --r1cs --wasm --sym --output bitwise_or_js");
            
            const wasmPath = path.join(__dirname, "bitwise_or_js", "bitwise_or_js", "bitwise_or.wasm");
            const wc = require("./bitwise_or_js/bitwise_or_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute 15 | 7 = 15", async function () {
        const input = { x: 15, y: 7 }; // 1111 | 0111 = 1111
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 15);
    });

    it("Should compute 240 | 15 = 255", async function () {
        const input = { x: 240, y: 15 }; // 11110000 | 00001111 = 11111111
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 255);
    });

    it("Should compute 0 | anything = anything", async function () {
        const input = { x: 0, y: 12345 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 12345);
    });

    it("Should compute anything | 0 = anything", async function () {
        const input = { x: 12345, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 12345);
    });

    it("Should compute 123 | 456 = 507", async function () {
        const input = { x: 123, y: 456 }; 
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 123 | 456);
    });
});