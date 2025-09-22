const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("RightShift Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("right_shift_js")) {
                fs.mkdirSync("right_shift_js");
            }
            await execPromise("circom right_shift.circom --r1cs --wasm --sym --output right_shift_js");
            
            const wasmPath = path.join(__dirname, "right_shift_js", "right_shift_js", "right_shift.wasm");
            const wc = require("./right_shift_js/right_shift_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should compute 16 >> 3 = 2", async function () {
        const input = { x: 16 }; // 16 shifted right by 3 = 2
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 2);
    });

    it("Should compute 240 >> 3 = 30", async function () {
        const input = { x: 240 }; // 11110000 >> 3 = 00011110 = 30
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 30);
    });

    it("Should compute 0 >> 3 = 0", async function () {
        const input = { x: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute 1000 >> 3 = 125", async function () {
        const input = { x: 1000 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, Math.floor(1000 / 8)); // Right shift by 3 is division by 8
    });

    it("Should compute 7 >> 3 = 0", async function () {
        const input = { x: 7 }; // Small number that becomes 0 when shifted right by 3
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, 0);
    });

    it("Should compute large number >> 3", async function () {
        const input = { x: 1000000 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        const result = Number(witness[1]);
        assert.equal(result, Math.floor(1000000 / 8));
    });
});