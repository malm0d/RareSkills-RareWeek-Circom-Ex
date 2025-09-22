pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template BitwiseNot() {
    signal input x;
    signal output out;
    
    // Convert input to binary
    // Perform bitwise NOT
    // Convert result back to number

    var n = 32;

    component n2b = Num2Bits(n);
    n2b.in <== x;

    signal bin[n];

    for (var i = 0; i < n; i++) {
        bin[i] <== 1 - n2b.out[i];
    }

    out <== Bits2Num(n)(bin);
}

component main = BitwiseNot();
