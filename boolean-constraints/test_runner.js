const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const circuits = ['binary_to_decimal', 'bitwise_and', 'bitwise_not', 'bitwise_or', 'bitwise_nand', 'bitwise_xor'];

async function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { cwd, stdio: 'inherit' });
        child.on('close', (code) => {
            resolve(code);
        });
        child.on('error', (err) => {
            reject(err);
        });
    });
}

async function testCircuit(circuitName) {
    const circuitDir = path.join(__dirname, circuitName);
    
    if (!fs.existsSync(circuitDir)) {
        console.log(`❌ Directory ${circuitName} not found!`);
        return false;
    }
    
    console.log(`\nTesting ${circuitName}...`);
    console.log('-'.repeat(17));
    
    try {
        // Compile the circuit
        console.log(`Compiling ${circuitName}...`);
        const compileCode = await runCommand('npm', ['run', 'compile'], circuitDir);
        
        if (compileCode !== 0) {
            console.log(`❌ ${circuitName} compilation failed!`);
            return false;
        }
        
        // Run tests
        console.log(`Running tests for ${circuitName}...`);
        const testCode = await runCommand('npm', ['test'], circuitDir);
        
        if (testCode === 0) {
            console.log(`✅ ${circuitName} tests passed!`);
            return true;
        } else {
            console.log(`❌ ${circuitName} tests failed!`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error testing ${circuitName}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('Testing all boolean constraint circuits...');
    console.log('=========================================');
    
    let results = {};
    
    for (const circuit of circuits) {
        results[circuit] = await testCircuit(circuit);
    }
    
    console.log('\n=========================================');
    console.log('Test Results Summary:');
    
    for (const [circuit, passed] of Object.entries(results)) {
        console.log(`${circuit}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    }
    
    console.log('All tests completed!');
}

main().catch(console.error);