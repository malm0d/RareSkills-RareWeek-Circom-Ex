pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";

template EvenNumber() {
    signal input x;
    
    // Convert input to binary
    // Constrain the least significant bit (bit 0) to be zero
    // This forces the number to be even

    var n = 32;

    component n2b = Num2Bits(n);

    n2b.in <== x;
    
    n2b.out[n-1] === 0;
}

component main = EvenNumber();
