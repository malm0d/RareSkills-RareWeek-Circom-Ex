pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template OpenClosedIntervals() {
    signal input x;
    signal input y;
    
    // Constrain x to be in [10, 15) and y to be in (15, 30)
    // x in [10, 15) means: x >= 10 AND x < 15
    // y in (15, 30) means: y > 15 AND y < 30

    signal xGte10 <== GreaterEqThan(252)([x, 10]);
    signal xLt15 <== LessThan(252)([x, 15]);

    signal yGt15 <== GreaterThan(252)([y, 15]);
    signal yLt30 <== LessThan(252)([y, 30]);

    1 === xGte10 * xLt15;
    1 === yGt15 * yLt30;
    
}

component main = OpenClosedIntervals();
