pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template MultipleIntervals() {
    signal input x;
    
    // Constrain x to be in [10, 20] or [40, 80] or [100, 200]
    // This means: (x >= 10 AND x <= 20) OR (x >= 40 AND x <= 80) OR (x >= 100 AND x <= 200)

    signal gte10 <== GreaterEqThan(252)([x, 10]);
    signal lte20 <== LessEqThan(252)([x, 20]);

    signal gte40 <== GreaterEqThan(252)([x, 40]);
    signal lte80 <== LessEqThan(252)([x, 80]);

    signal gte100 <== GreaterEqThan(252)([x, 100]);
    signal lte200 <== LessEqThan(252)([x, 200]);

    // AND gates
    signal tenAndTwenty <== gte10 * lte20;
    signal fortyAndEighty <== gte40 * lte80;
    signal hundredAndTwoHundred <== gte100 * lte200;

    //OR gates
    signal s1 <== tenAndTwenty + fortyAndEighty - (tenAndTwenty * fortyAndEighty);
    1 === s1 + hundredAndTwoHundred - (s1 * hundredAndTwoHundred);
    
}

component main = MultipleIntervals();
