pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template RightShift() {
    signal input x;
    signal output out;
    
    // Convert input to binary
    // Perform right shift by 3 positions
    // This means shifting all bits 3 positions to the right
    // Bits that underflow (positions 0-2) are ignored
    // Convert result back to number

    // [1, 1, 0, 0, 1, 1, 0, 1] --> Right shift by 3 --> [0, 0, 0, 1, 1, 0, 0, 1]
    // (MSB)               (LSB)                        (MSB)                (LSB)
    // By convention, the LSB is index 0 in the array of bits.
    // So the right most in the above is the LSB (treat the above array as reversed).

    var n = 32;
    var shift = 3;

    component n2b = Num2Bits(n);
    n2b.in <== x;

    signal shifted[n];

    for (var i = 0; i < n - shift; i++) {
        shifted[i] <== n2b.out[i + shift];
    }

    for (var j = n - shift; j < n; j++) {
        shifted[j] <== 0;
    }

    out <== Bits2Num(n)(shifted);
}

component main = RightShift();
