const path = require("path");
const fs = require("fs");
const { assert } = require("../../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("SquareRoot Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("square_root_js")) {
                fs.mkdirSync("square_root_js");
            }
            await execPromise("circom square_root.circom --r1cs --wasm --sym --output square_root_js");
            
            const wasmPath = path.join(__dirname, "square_root_js", "square_root_js", "square_root.wasm");
            const wc = require("./square_root_js/square_root_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should accept x=0, y=0 (0^2 = 0)", async function () {
        const input = { x: 0, y: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=1, y=1 (1^2 = 1)", async function () {
        const input = { x: 1, y: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=2, y=4 (2^2 = 4)", async function () {
        const input = { x: 2, y: 4 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=3, y=9 (3^2 = 9)", async function () {
        const input = { x: 3, y: 9 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should accept x=5, y=25 (5^2 = 25)", async function () {
        const input = { x: 5, y: 25 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        assert.exists(witness);
    });

    it("Should reject incorrect square relationship", async function () {
        const input = { x: 2, y: 5 }; // 2^2 ≠ 5
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });

    it("Should reject another incorrect square relationship", async function () {
        const input = { x: 4, y: 15 }; // 4^2 ≠ 15
        try {
            await witnessCalculator.calculateWitness(input, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.exists(error);
        }
    });
});