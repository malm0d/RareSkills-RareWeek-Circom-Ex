pragma circom 2.0.0;

template BitwiseAnd() {
    signal input x1, x2, x3, x4;
    signal input y1, y2, y3, y4;
    signal input z1, z2, z3, z4;

    x1 * (x1 - 1) === 0;
    x2 * (x2 - 1) === 0;
    x3 * (x3 - 1) === 0;
    x4 * (x4 - 1) === 0;

    y1 * (y1 - 1) === 0;
    y2 * (y2 - 1) === 0;
    y3 * (y3 - 1) === 0;
    y4 * (y4 - 1) === 0;

    z1 * (z1 - 1) === 0;
    z2 * (z2 - 1) === 0;
    z3 * (z3 - 1) === 0;
    z4 * (z4 - 1) === 0;

    x1 * y1 === z1;
    x2 * y2 === z2;
    x3 * y3 === z3;
    x4 * y4 === z4;
        
}

component main = BitwiseAnd();
