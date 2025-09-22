const path = require("path");
const fs = require("fs");
const { assert } = require("../node_modules/chai");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

describe("RotateRight Circuit", function () {
    let witnessCalculator;

    before(async function () {
        this.timeout(10000);
        try {
            if (!fs.existsSync("rotate_right_js")) {
                fs.mkdirSync("rotate_right_js");
            }
            await execPromise("circom rotate_right.circom --r1cs --wasm --sym --output rotate_right_js");
            
            const wasmPath = path.join(__dirname, "rotate_right_js", "rotate_right_js", "rotate_right.wasm");
            const wc = require("./rotate_right_js/rotate_right_js/witness_calculator.js");
            const buffer = fs.readFileSync(wasmPath);
            witnessCalculator = await wc(buffer);
        } catch (error) {
            console.error("Setup error:", error);
            throw error;
        }
    });

    it("Should rotate right by 1: [A, B, C, D, E, F, G, H] to [H, A, B, C, D, E, F, G]", async function () {
        const input = { 
            arr: [1, 2, 3, 4, 5, 6, 7, 8]  // A=1, B=2, etc.
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        // Extract the output signals (rotated array)
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [8, 1, 2, 3, 4, 5, 6, 7]);
    });

    it("Should handle rotation with zeros [0, 1, 2, 3, 0, 0, 6, 7] to [7, 0, 1, 2, 3, 0, 0, 6]", async function () {
        const input = { 
            arr: [0, 1, 2, 3, 0, 0, 6, 7]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [7, 0, 1, 2, 3, 0, 0, 6]);
    });

    it("Should handle all same elements [5, 5, 5, 5, 5, 5, 5, 5] to [5, 5, 5, 5, 5, 5, 5, 5]", async function () {
        const input = { 
            arr: [5, 5, 5, 5, 5, 5, 5, 5]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [5, 5, 5, 5, 5, 5, 5, 5]);
    });

    it("Should handle binary pattern [1, 0, 1, 0, 0, 1, 0, 1] to [1, 1, 0, 1, 0, 0, 1, 0]", async function () {
        const input = { 
            arr: [1, 0, 1, 0, 0, 1, 0, 1]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [1, 1, 0, 1, 0, 0, 1, 0]);
    });

    it("Should handle ascending sequence [10, 20, 30, 40, 50, 60, 70, 80] to [80, 10, 20, 30, 40, 50, 60, 70]", async function () {
        const input = { 
            arr: [10, 20, 30, 40, 50, 60, 70, 80]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [80, 10, 20, 30, 40, 50, 60, 70]);
    });

    it("Should handle descending sequence [8, 7, 6, 5, 4, 3, 2, 1] to [1, 8, 7, 6, 5, 4, 3, 2]", async function () {
        const input = { 
            arr: [8, 7, 6, 5, 4, 3, 2, 1]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [1, 8, 7, 6, 5, 4, 3, 2]);
    });

    it("Should handle alternating pattern [1, 2, 3, 4, 5, 6, 7, 8] to [8, 1, 2, 3, 4, 5, 6, 7]", async function () {
        const input = { 
            arr: [1, 2, 3, 4, 5, 6, 7, 8]
        };
        const witness = await witnessCalculator.calculateWitness(input, 0);
        
        const rotated = [witness[1], witness[2], witness[3], witness[4], witness[5], witness[6], witness[7], witness[8]];
        
        assert.deepEqual(rotated.map(x => Number(x)), [8, 1, 2, 3, 4, 5, 6, 7]);
    });
});