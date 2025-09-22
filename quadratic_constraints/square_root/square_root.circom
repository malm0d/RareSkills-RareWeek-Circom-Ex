pragma circom 2.0.0;

template SquareRoot() {
    signal input x;
    signal input y;
    
    // Constrain x to be the square root of y
    // This means x^2 = y
    y === x * x;
}

component main = SquareRoot();