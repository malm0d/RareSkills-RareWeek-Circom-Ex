pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template BitwiseAnd() {
    signal input x;
    signal input y;
    signal output out;
    
    // Convert inputs to binary
    // Perform bitwise AND
    // Convert result back to number

    var n = 32; //this means we are dealing with at most 32 bit numbers

    component n2bX = Num2Bits(n);
    component n2bY = Num2Bits(n);

    n2bX.in <== x;
    n2bY.in <== y;


    signal _and[n];
    for (var i = 0; i < n; i++) {
        _and[i]<== n2bX.out[i] * n2bY.out[i];
    }

    out <== Bits2Num(n)(_and);
}

component main = BitwiseAnd();
