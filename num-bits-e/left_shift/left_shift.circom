pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template LeftShift() {
    signal input x;
    signal output out;
    
    // Convert input to binary
    // Perform left shift by 4 positions
    // This means shifting all bits 4 positions to the left
    // Bits that overflow (positions 28-31) are ignored
    // Convert result back to number

    // [1, 1, 0, 0, 1, 1, 0, 1] --> Left shift by 4 --> [1, 1, 0, 1, 0, 0, 0, 0]
    // (MSB)               (LSB)                       (MSB)                (LSB)
    // By convention, the LSB is index 0 in the array of bits.
    // So the right most in the above is the LSB (treat the above array as reversed).

    var n = 32;
    var shift = 4;

    component n2b = Num2Bits(n);
    n2b.in <== x;

    signal shifted[n];

    for (var i = 0; i < shift; i++) {
        shifted[i] <== 0;
    }

    for (var j = shift; j < n; j++) {
        shifted[j] <== n2b.out[j - shift];
    }

    out <== Bits2Num(n)(shifted);
}

component main = LeftShift();
