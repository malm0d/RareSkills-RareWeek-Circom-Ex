pragma circom 2.0.0;

// Write a circuit that constrains the boolean value of z to equal the Boolean AND of x y u
template AndThreeBool() {
    signal input x;
    signal input y;
    signal input u;
    signal input z;

    signal s1 <== x * y;

    0 === x * (x - 1);
    0 === y * (y - 1);
    0 === u * (u - 1);
    0 === z * (z - 1);
    z === s1 * u;

}

component main = AndThreeBool();

