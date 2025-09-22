pragma circom 2.0.0;

//Write a circuit that constrains x to be equal to either 16, 20, or 24
template SixteenOrTwentyOrTwentyfour() {
    signal input x;

    signal s1 <== (x - 16) * (x - 20);
    
    0 === s1 * (x - 24);

}

component main = SixteenOrTwentyOrTwentyfour();

