pragma circom 2.0.0;

// Write a circuit that constrains x to be the cube root of z
template CubeRoot() {
    signal input x;
    signal input z;

    signal s1 <== x * x;
    z === s1 * x;
}

component main = CubeRoot();

