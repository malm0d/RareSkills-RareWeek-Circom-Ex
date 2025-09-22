pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template ExcludedIntervals() {
    signal input x;
    
    // Constrain x to NOT be in [0, 20] and NOT be in [25, 100)
    // This means: (x < 0 OR x > 20) AND (x < 25 OR x >= 100)
    // Equivalently: x NOT in [0, 20] AND x NOT in [25, 99] (since [25, 100) = [25, 99] for integers)

    signal isLtZero <== LessThan(252)([x, 0]);
    signal isGtTwenty <== GreaterThan(252)([x, 20]);

    signal isLtTwentyFive <== LessThan(252)([x, 25]);
    signal isGteHundred <== GreaterEqThan(252)([x, 100]);

    // OR gates
    signal notZeroOrTwenty <== isLtZero + isGtTwenty - (isLtZero * isGtTwenty);
    signal notTwentyFiveOrNinetyNine <== isLtTwentyFive + isGteHundred - (isLtTwentyFive * isGteHundred);

    // AND gate
    1 === notZeroOrTwenty * notTwentyFiveOrNinetyNine;
}

component main = ExcludedIntervals();
