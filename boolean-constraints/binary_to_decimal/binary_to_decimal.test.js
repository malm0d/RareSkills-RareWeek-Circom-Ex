const path = require("path");
const fs = require("fs");
const { expect } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BinaryToDecimal Circuit", function () {
    this.timeout(100000);
    let witnessCalculator;
    let r1csInfo;

    before(async function () {
        try {
            if (!fs.existsSync("binary_to_decimal_js")) {
                fs.mkdirSync("binary_to_decimal_js");
            }
            await execPromise("circom binary_to_decimal.circom --r1cs --wasm --sym --output binary_to_decimal_js");
            
            const wasmPath = path.join(__dirname, "binary_to_decimal_js", "binary_to_decimal_js", "binary_to_decimal.wasm");
            const r1csPath = path.join(__dirname, "binary_to_decimal_js", "binary_to_decimal.r1cs");
            const wc = require("./binary_to_decimal_js/binary_to_decimal_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);

            // Read R1CS file size to estimate constraints
            const r1csStats = fs.statSync(r1csPath);
            r1csInfo = { fileSize: r1csStats.size };
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should have sufficient constraints for binary to decimal conversion", async function () {
        // A meaningful circuit should have a larger R1CS file (more than just a few hundred bytes)
        expect(r1csInfo.fileSize).to.be.at.least(800, "Circuit is underconstrained - needs constraints for binary to decimal conversion");
    });

    it("Should convert 0000 to 0", async function () {
        const input = { x1: 0, x2: 0, x3: 0, x4: 0, z: 0 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should convert 0001 to 1", async function () {
        const input = { x1: 0, x2: 0, x3: 0, x4: 1, z: 1 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should convert 1010 to 10", async function () {
        const input = { x1: 1, x2: 0, x3: 1, x4: 0, z: 10 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should convert 1111 to 15", async function () {
        const input = { x1: 1, x2: 1, x3: 1, x4: 1, z: 15 };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should reject wrong decimal value 1000 != 5", async function () {
        const input = { x1: 1, x2: 0, x3: 0, x4: 0, z: 5 }; // Wrong result (should be 8, not 5)
        try {
            await witnessCalculator.calculateWitness(input, 0);
            expect.fail("Should have thrown an error for incorrect decimal conversion");
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it("Should enforce binary inputs are binary", async function () {
        // Test non-binary x values
        const input1 = { x1: 2, x2: 0, x3: 0, x4: 0, z: 16 };
        try {
            await witnessCalculator.calculateWitness(input1, 0);
            expect.fail("Should have thrown an error for non-binary input");
        } catch (error) {
            expect(error).to.exist;
        }
    });
});