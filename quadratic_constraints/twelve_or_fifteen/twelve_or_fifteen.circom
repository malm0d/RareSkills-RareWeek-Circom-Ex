pragma circom 2.0.0;

template TwelveOrFifteen() {
    signal input x;
    
    // Constrain x to be 12 or 15
    // This means (x - 12) * (x - 15) = 0
    // Expanding: x^2 - 27x + 180 = 0
    0 === (x - 12) * (x - 15);
}

component main = TwelveOrFifteen();