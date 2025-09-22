pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template IntervalConstraint() {
    signal input x;

    // Write a circuit that constrains x to be in the interval [0, 5]
    component gt = GreaterThan(8);
    component lt = LessThan(8);

    gt.in[0] <== x;
    gt.in[1] <== -1;
    1 === gt.out;

    lt.in[0] <== x;
    lt.in[1] <== 6;
    1 === lt.out;

}

component main = IntervalConstraint();
