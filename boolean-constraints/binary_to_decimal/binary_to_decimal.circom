pragma circom 2.0.0;

template BinaryToDecimal() {
    signal input x1;
    signal input x2;
    signal input x3;
    signal input x4;
    signal input z;

    // Assume that z is a 4 bit number
    // Thus z < 2^4 = 16
    // The binary rep for any 4 but number is: 8*x1 + 4*x2 + 2*x3 + x4

    signal x1_, x2_, x3_;

    x1 * (x1 - 1) === 0;
    x2 * (x2 - 1) === 0;
    x3 * (x3 - 1) === 0;
    x4 * (x4 - 1) === 0;

    x1_ <-- 8 * x1;
    x2_ <-- 4 * x2;
    x3_ <-- 2 * x3;

    z === x1_ + x2_ + x3_ + x4;
    
}

component main = BinaryToDecimal();
