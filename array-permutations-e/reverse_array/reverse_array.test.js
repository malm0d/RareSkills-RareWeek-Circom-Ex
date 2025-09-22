const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("ReverseArray Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("reverse_array_js")) {
                fs.mkdirSync("reverse_array_js");
            }
            await execPromise("circom reverse_array.circom --r1cs --wasm --sym --output reverse_array_js");
            
            const wasmPath = path.join(__dirname, "reverse_array_js", "reverse_array_js", "reverse_array.wasm");
            const wc = require("./reverse_array_js/reverse_array_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should reverse array [1, 2, 3, 4, 5, 6, 7, 8] to [8, 7, 6, 5, 4, 3, 2, 1]", async function () {
        const input = { 
            arr: [1, 2, 3, 4, 5, 6, 7, 8]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        // Extract the output signals (reversed array)
        // Witness[0] is always 1, then we have the output signals (reversed array)
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [8, 7, 6, 5, 4, 3, 2, 1]);
    });

    it("Should reverse array [0, 1, 0, 1, 1, 0, 1, 0] to [0, 1, 0, 1, 1, 0, 1, 0]", async function () {
        const input = { 
            arr: [0, 1, 0, 1, 1, 0, 1, 0]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [0, 1, 0, 1, 1, 0, 1, 0]);
    });

    it("Should reverse array [5, 10, 15, 20, 25, 30, 35, 40] to [40, 35, 30, 25, 20, 15, 10, 5]", async function () {
        const input = { 
            arr: [5, 10, 15, 20, 25, 30, 35, 40]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [40, 35, 30, 25, 20, 15, 10, 5]);
    });

    it("Should handle palindromic array [1, 2, 3, 4, 4, 3, 2, 1] to [1, 2, 3, 4, 4, 3, 2, 1]", async function () {
        const input = { 
            arr: [1, 2, 3, 4, 4, 3, 2, 1]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [1, 2, 3, 4, 4, 3, 2, 1]);
    });

    it("Should handle array with zeros [0, 0, 3, 4, 5, 6, 0, 0] to [0, 0, 6, 5, 4, 3, 0, 0]", async function () {
        const input = { 
            arr: [0, 0, 3, 4, 5, 6, 0, 0]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [0, 0, 6, 5, 4, 3, 0, 0]);
    });

    it("Should handle all same elements [7, 7, 7, 7, 7, 7, 7, 7] to [7, 7, 7, 7, 7, 7, 7, 7]", async function () {
        const input = { 
            arr: [7, 7, 7, 7, 7, 7, 7, 7]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const reversed = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(reversed.map(x => Number(x)), [7, 7, 7, 7, 7, 7, 7, 7]);
    });
});