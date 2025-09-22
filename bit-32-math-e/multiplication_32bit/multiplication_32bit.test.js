const path = require("path");
const fs = require("fs");
const { assert } = require("chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("Multiplication32Bit Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("multiplication_32bit_js")) {
                fs.mkdirSync("multiplication_32bit_js");
            }
            await execPromise("circom multiplication_32bit.circom --r1cs --wasm --sym --output multiplication_32bit_js");
            
            const wasmPath = path.join(__dirname, "multiplication_32bit_js", "multiplication_32bit_js", "multiplication_32bit.wasm");
            const wc = require("./multiplication_32bit_js/multiplication_32bit_js/witness_calculator.js");
            
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Error during circuit compilation:", error);
            throw error;
        }
    });

    it("should multiply two 32-bit numbers correctly", async function () {
        const x = 12345;
        const y = 6789;
        const expectedProduct = (x * y) % (2**32); // Modulo 2^32 to get the lower 32 bits
        
        const witness = await witnessCalculator.calculateWitness({ x: x, y: y });
        
        // Verify the multiplication result is correct
        assert.equal(witness[0], "1");
        // Check the output signal (witness[1] is the out signal)
        assert.equal(witness[1], expectedProduct.toString());
    });

    it("should handle edge case: multiplication by zero", async function () {
        const x = 12345;
        const y = 0;
        const expectedProduct = 0;
        
        const witness = await witnessCalculator.calculateWitness({ x: x, y: y });
        
        assert.equal(witness[0], "1");
        assert.equal(witness[1], expectedProduct.toString());
    });

    it("should handle edge case: multiplication by one", async function () {
        const x = 12345;
        const y = 1;
        const expectedProduct = 12345;
        
        const witness = await witnessCalculator.calculateWitness({ x: x, y: y });
        
        assert.equal(witness[0], "1");
        assert.equal(witness[1], expectedProduct.toString());
    });

    it("should handle maximum 32-bit values", async function () {
        const x = 65535; // 2^16 - 1
        const y = 65535; // 2^16 - 1
        const expectedProduct = (x * y) % (2**32); // Modulo 2^32 to get the lower 32 bits
        
        const witness = await witnessCalculator.calculateWitness({ x: x, y: y });
        
        assert.equal(witness[0], "1");
        assert.equal(witness[1], expectedProduct.toString());
    });
});