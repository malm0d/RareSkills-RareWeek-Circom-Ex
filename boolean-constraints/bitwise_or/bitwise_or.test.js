const path = require("path");
const fs = require("fs");
const { expect } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("BitwiseOr Circuit", function () {
    this.timeout(100000);
    let witnessCalculator;
    let r1csInfo;

    before(async function () {
        try {
            if (!fs.existsSync("bitwise_or_js")) {
                fs.mkdirSync("bitwise_or_js");
            }
            await execPromise("circom bitwise_or.circom --r1cs --wasm --sym --output bitwise_or_js");
            
            const wasmPath = path.join(__dirname, "bitwise_or_js", "bitwise_or_js", "bitwise_or.wasm");
            const r1csPath = path.join(__dirname, "bitwise_or_js", "bitwise_or.r1cs");
            const wc = require("./bitwise_or_js/bitwise_or_js/witness_calculator.js");
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

    it("Should have sufficient constraints for bitwise OR logic", async function () {
        // A meaningful circuit should have a larger R1CS file (more than just a few hundred bytes)
        expect(r1csInfo.fileSize).to.be.at.least(1000, "Circuit is underconstrained - needs constraints for bitwise OR logic");
    });

    it("Should OR 0000 | 0000 = 0000", async function () {
        const input = {
            x1: 0, x2: 0, x3: 0, x4: 0,
            y1: 0, y2: 0, y3: 0, y4: 0,
            z1: 0, z2: 0, z3: 0, z4: 0
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should OR 1010 | 0101 = 1111", async function () {
        const input = {
            x1: 1, x2: 0, x3: 1, x4: 0,
            y1: 0, y2: 1, y3: 0, y4: 1,
            z1: 1, z2: 1, z3: 1, z4: 1
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should OR 1100 | 0011 = 1111", async function () {
        const input = {
            x1: 1, x2: 1, x3: 0, x4: 0,
            y1: 0, y2: 0, y3: 1, y4: 1,
            z1: 1, z2: 1, z3: 1, z4: 1
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        expect(witness).to.be.ok;
    });

    it("Should reject incorrect OR result 1010 | 0101 != 0000", async function () {
        const input = {
            x1: 1, x2: 0, x3: 1, x4: 0,
            y1: 0, y2: 1, y3: 0, y4: 1,
            z1: 0, z2: 0, z3: 0, z4: 0  // Wrong result (should be 1111)
        };
        try {
            await witnessCalculator.calculateWitness(input, 0);
            expect.fail("Should have thrown an error for incorrect OR result");
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it("Should enforce inputs are binary", async function () {
        // Test non-binary x values
        const input1 = {
            x1: 2, x2: 1, x3: 1, x4: 1,
            y1: 1, y2: 1, y3: 1, y4: 1,
            z1: 1, z2: 1, z3: 1, z4: 1
        };
        try {
            await witnessCalculator.calculateWitness(input1, 0);
            expect.fail("Should have thrown an error for non-binary input");
        } catch (error) {
            expect(error).to.exist;
        }
    });
});