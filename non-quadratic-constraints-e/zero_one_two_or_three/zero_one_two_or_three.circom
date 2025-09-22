pragma circom 2.0.0;

// Write a circuit that constrains x to be equal to either 0, 1, 2, 3
template ZeroOneTwoOrThree() {
    signal input x;

    //x(x-1)(x-2)(x-3) = 0
    
    signal s1 <== (x - 1) * (x - 2);
    signal s2 <== s1 * (x - 3);
    0 === x * s2;


}

component main = ZeroOneTwoOrThree();

