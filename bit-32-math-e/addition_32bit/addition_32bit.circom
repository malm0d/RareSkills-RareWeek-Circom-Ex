pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/binsum.circom";

template Addition32Bit() {
    signal input x;
    signal input y;
    signal output out;
    
    // (Ignore)
    // Convert inputs to 32-bit binary to constrain them to be < 2^32
    // Add the two numbers bit by bit with carry
    // We need 33 bits to store the intermediate result (32 bits + 1 carry bit)
    // Feed the bits to BinSum
    // Take only the least significant 32 bits (ignore carry/overflow)
    // (Ignore)

    var n = 32;

    // Implicit range check on inputs
    component n2bX = Num2Bits(n);
    component n2bY = Num2Bits(n);

    // To bits
    n2bX.in <== x;
    n2bY.in <== y;

    // Add x and y to get the value of z1
    signal z1 <== x + y;

    // Since z could potentially be 33 bits, we give n+1
    // Then convert z1 to its binary
    component n2bZ = Num2Bits(n+1);
    n2bZ.in <== z1;

    // Take the least significant 32 bits (overflow)
    signal z2[n];
    for (var i = 0; i < n; i++) {
        z2[i] <== n2bZ.out[i];
    }

    out <== Bits2Num(n)(z2);
}

component main = Addition32Bit();
