Run in zkrepl.dev to test and check output.

1. Powers of x
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

template Selector (n) {
    signal input in[n];
    signal input index;
    signal output out;

    component eqs[n]; //array of components

    signal isEqual[n];

    for (var i = 0; i < n; i++) {
        eqs[i] = IsEqual();
        eqs[i].in[0] <== i;
        eqs[i].in[1] <== index;

        isEqual[i] <== eqs[i].out * in[i];
    }

    var sum;
    for (var i = 0; i < n; i++) {
        sum += isEqual[i];
    }

    out <== sum;
}

template Powers (n) {
    signal input base;
    signal input e;
    signal output out;

    assert(n > 0);

    signal powers[n];
    powers[0] <== 1;

    //[1, x^1, x^2, x^3, ... x^(n-1)]
    for (var i = 1; i < n; i++) {
        powers[i] <== powers[i - 1] * base;
    }

    component selectr = Selector(n);
    selectr.in <== powers;
    selectr.index <== e;

    out <== selectr.out;

}

component main = Powers(252);

/* INPUT = {
    "base": 2,
    "e": 251
} */
```
//----------------------------------------------------------------------

2. n-th Fibonacci number
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

/**
 * The n-th fibonacci number means picking the n-th number in a
 * fibonacci sequence:
 * [0, 1, 1, 2, 3, 5, 8, 13, 21, ... ]
 * Then the 5th fibonacci number = 3.
 */
template Fibonacci (n) {
    signal input nthNum;
    signal output out;

    assert(n > 0);
    signal gteOne <== GreaterEqThan(252)([nthNum, 1]);
    1 === gteOne;

    signal fiboSeq[n];

    fiboSeq[0] <== 0;
    fiboSeq[1] <== 1;

    for (var i = 2; i < n; i++) {
        fiboSeq[i] <== fiboSeq[i - 1] + fiboSeq[i - 2];
    }

    component selectr = Selector(n);
    for (var i = 0; i < n; i++) {
        selectr.in[i] <== fiboSeq[i];
    }
    selectr.index <== nthNum - 1; // convert 1-based to 0-based indexing

    out <== selectr.out;

}

template Selector (n) {
    signal input in[n];
    signal input index;
    signal output out;

    component eqs[n];

    signal product[n];

    for (var i = 0; i < n; i++) {
        eqs[i] = IsEqual();
        eqs[i].in[0] <== i;
        eqs[i].in[1] <== index;

        product[i] <== eqs[i].out * in[i];
    }

    var sum;
    for (var i = 0; i < n; i++) {
        sum += product[i];
    }

    out <== sum;
}

component main = Fibonacci(10);

/* INPUT = {
    "nthNum": "9"
} */
```
//----------------------------------------------------------------------

3. Factorial
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

// n! = n(n - 1)(n - 2)(n - 3)...(2)(1)
// Factorial is the product of all integers from 1 to n.
// Factorials: [0!, 1!, 2!, 3!, ..., n!]
//             [1,  1,  2,  6,  24,  120, ..., n]
template Factorial (maxN) {
    signal input in;
    signal output out;

    assert(maxN > 0);

    // Account for 0! = 1
    signal factorials[maxN + 1];

    factorials[0] <== 1;

    // E.g. 5! = (1(1(2(3(4(5))))))
    for (var i = 1; i < maxN; i++) {
        factorials[i] <== i * factorials[i - 1];
    }

    component selectr = Selector(maxN);

    for (var i = 0; i < maxN; i++) {
        selectr.in[i] <== factorials[i];
    }
    selectr.index <== in;

    out <== selectr.out;
}

template Selector (n) {
    signal input in[n];
    signal input index;
    signal output out;

    component eqs[n];

    signal product[n];
    for (var i = 0; i < n; i++) {
        eqs[i] = IsEqual();
        eqs[i].in[0] <== i;
        eqs[i].in[1] <== index;

        product[i] <== eqs[i].out * in[i];
    }

    var sum;
    for (var i = 0; i < n; i++) {
        sum += product[i];
    }

    out <== sum;
}

component main = Factorial(10);

/* INPUT = {
    "in": "5"
} */
```