pragma circom 2.0.0;

// Write a circuit that constrains the boolean value of z to equal with (x || !y) && !u
template XOrNotYAndNotU() {
    signal input x;
    signal input y;
    signal input u;
    signal input z;

    // !u is (1 - u)
    // !y is (1 -y)
    // x or y is (x + y - xy)
    // x && y is x * y

    0 === x * (x - 1);
    0 === y * (y - 1);
    0 === u * (u - 1);
    0 === z * (z - 1);

    signal _or <== x + (1 - y) - (x * (1 - y));
    z === _or * (1 - u);



}

component main = XOrNotYAndNotU();

