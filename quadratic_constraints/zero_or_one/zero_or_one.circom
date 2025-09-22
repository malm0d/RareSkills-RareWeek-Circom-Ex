pragma circom 2.0.0;

template ZeroOrOne() {
    signal input x;
    
    // Constrain x to be 0 or 1
    // This is the same as the binary constraint: x * (1 - x) = 0
    x * (x - 1) === 0;
}

component main = ZeroOrOne();
//circom zero_or_one.circom 