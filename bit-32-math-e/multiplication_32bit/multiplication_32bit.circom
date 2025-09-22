pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template Multiplication32Bit() {
    signal input x;
    signal input y;
    signal output out;
    
    // Convert inputs to 32-bit binary to constrain them to be < 2^32
    // Perform multiplication using the standard algorithm
    // x * y can be up to 64 bits (2^32 * 2^32 = 2^64)
    // We'll compute the full 64-bit result and then take the lower 32 bits
    // Convert back to numbers for multiplication
    // Multiply the numbers
    // Convert the product to 64 bits
    // Take only the least significant 32 bits

    var n = 32;

    component n2bX = Num2Bits(n);
    component n2bY = Num2Bits(n);

    n2bX.in <== x;
    n2bY.in <== y;

    signal xy <== x * y;

    signal prod64Bits[n*2] <== Num2Bits(n * 2)(xy);
    
    signal prod32Bits[n];
    for (var i = 0; i < n; i++) {
        prod32Bits[i] <== prod64Bits[i];
    }

    out <== Bits2Num(n)(prod32Bits);
}

component main = Multiplication32Bit();
