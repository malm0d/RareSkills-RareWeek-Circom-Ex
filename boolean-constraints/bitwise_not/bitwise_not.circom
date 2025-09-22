pragma circom 2.0.0;

template BitwiseNot() {
    signal input x1, x2, x3, x4;
    signal input z1, z2, z3, z4;

    x1 * (x1 - 1) === 0;
    x2 * (x2 - 1) === 0;
    x3 * (x3 - 1) === 0;
    x4 * (x4 - 1) === 0;

    z1 * (z1 - 1) === 0;
    z2 * (z2 - 1) === 0;
    z3 * (z3 - 1) === 0;
    z4 * (z4 - 1) === 0;

    z1 === 1 - x1;
    z2 === 1 - x2;
    z3 === 1 - x3;
    z4 === 1 - x4;
    
}

component main = BitwiseNot();