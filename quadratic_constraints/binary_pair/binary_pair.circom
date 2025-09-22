pragma circom 2.0.0;

template BinaryPair() {
    signal input x;
    signal input y;

    x * (1 - x) === 0;
    y * (1 - y) === 0;
}

component main = BinaryPair();