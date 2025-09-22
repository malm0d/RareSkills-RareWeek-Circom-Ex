pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template DisjointIntervals() {
    signal input x;
    
    // Constrain x to be in [0, 5] or [20, 40]
    // This means: (x >= 0 AND x <= 5) OR (x >= 20 AND x <= 40)

    signal gte0 <== GreaterEqThan(252)([x, 0]);
    signal lte5 <== LessEqThan(252)([x, 5]);

    signal gte20 <== GreaterEqThan(252)([x, 20]);
    signal lte40 <== LessEqThan(252)([x, 40]);

    signal zeroToFive <== gte0 * lte5;
    signal twentyToForty <== gte20 * lte40;

    //OR gate
    1 === zeroToFive + twentyToForty - (zeroToFive * twentyToForty);
    
}

component main = DisjointIntervals();
