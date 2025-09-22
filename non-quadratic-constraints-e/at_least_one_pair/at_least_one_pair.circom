pragma circom 2.0.0;

//Write a circuit that constrains the boolean value of z to equal with (x || !y) && !u
template AtLeastOnePair() {
    signal input x;
    signal input y;
    signal input w;

}

component main = AtLeastOnePair();

