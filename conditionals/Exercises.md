Run in zkrepl.dev to test and check output.

Easy:

//----------------------------------------------------------------------
1. If x < 7, out = 4, else out = 19
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//If x < 7, out = 4, else out = 19
template Q1 () {
    signal input x;
    signal output out;

    component lt7 = LessThan(252);
    lt7.in[0] <== x;
    lt7.in[1] <== 7;

    out <== (lt7.out * 4) + (19) * (1 - lt7.out);
}

component main = Q1();

/* 
INPUT = {"x": 7} 
*/

//output: 19
```
//----------------------------------------------------------------------

2. If x > 2 and x < 10, out = 2, else out = 20
```circom
//2. If x > 2 and x < 10, out = 2, else out = 20
template Q2 () {
    signal input x;
    signal output out;

    component gt2 = GreaterThan(252);
    component lt10 = LessThan(252);

    gt2.in[0] <== x;
    gt2.in[1] <== 2;

    lt10.in[0] <== x;
    lt10.in[1] <== 10;

    signal gt2AndLt10 <== gt2.out * lt10.out;

    out <== (2 * gt2AndLt10) + (20 * (1 - gt2AndLt10));
}

component main = Q2();

/* 
INPUT = {"x":10} 
*/

//output: 20
```
//----------------------------------------------------------------------

3. If x == 2 or x == 4, out = 7, else out = 30
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//3. If x == 2 or x == 4, out = 7, else out = 30
template Q3 () {
    signal input x;
    signal output out;

    signal isEq2 <== IsEqual()([x, 2]);
    signal isEq4 <== IsEqual()([x, 4]);

    signal twoOrFour <== isEq2 + isEq4;

    out <== (7 * twoOrFour) + (30 * (1 - twoOrFour));
}

component main = Q3();

/* 
INPUT = {"x":4} 
*/

//output: 7
```
//----------------------------------------------------------------------

4. If x == 3, out = y, else out = z
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//4. If x == 3, out = y, else out = z
template Q4 () {
    signal input x;
    signal input y;
    signal input z;
    signal output out;

    signal isEq3 <== IsEqual()([x, 3]);
    
    signal outY <== y * isEq3;
    signal outZ <== z * (1 - isEq3);

    out <== (outY) + (outZ);
    
}

component main = Q4();

/* 
INPUT = {"x":3, "y": 7, "z": 10} 
*/

//output: 7
```
//----------------------------------------------------------------------

5. If x == 4 or x == 5, out = y, else out = z
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//5. If x == 4 or x == 5, out = y, else out = z
template Q5 () {
    signal input x;
    signal input y;
    signal input z;
    signal output out;

    signal isEq4 <== IsEqual()([x, 4]);
    signal isEq5 <== IsEqual()([x, 5]);
    
    signal isFourOrFive <== isEq4 + isEq5 - isEq4 * isEq5;

    signal outY <== (y * isFourOrFive);
    out <== outY + (z * (1 - isFourOrFive));
}

component main = Q5();

/* 
INPUT = {"x":6, "y": 7, "z": 10} 
*/

//output: 10
```
//----------------------------------------------------------------------

Hard:

6. If `in` is in the range [0,9] set `out` to be `0`. If `in` is in the range [10,99], set `out` to be `10`. If `in` is in the range [100, 999], set `out` to be `100`. For any other range, set the constraints so that `in` doesn't accept it.
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//6. If `in` is in the range [0,9] set `out` to be `0`. If `in` is in the range [10,99], 
//   set `out` to be `10`. If `in` is in the range [100, 999], set `out` to be `100`. 
//   For any other range, set the constraints so that `in` doesn't accept it.
template Q6 () {
    signal input in;
    signal output out;

    component gte0 = GreaterEqThan(252);
    component lte9 = LessEqThan(252);
    component gte10 = GreaterEqThan(252);
    component lte99 = LessEqThan(252);
    component gte100 = GreaterEqThan(252);
    component lte999 = LessEqThan(252);

    gte0.in[0] <== in;
    gte0.in[1] <== 0;

    lte9.in[0] <== in;
    lte9.in[1] <== 9;

    gte10.in[0] <== in;
    gte10.in[1] <== 10;

    lte99.in[0] <== in; 
    lte99.in[1] <== 99;

    gte100.in[0] <== in;
    gte100.in[1] <== 100;

    lte999.in[0] <== in;
    lte999.in[1] <== 999;

    signal zeroToNine <== gte0.out * lte9.out;
    signal tenToNineNine <== gte10.out * lte99.out;
    signal hundredToNineNineNine <== gte100.out * lte999.out;

    //Constraint `in` to be in one of the intervals, if `in` falls into one,
    //then the sum should be 1.
    1 === zeroToNine + tenToNineNine + hundredToNineNineNine;

    out <== (0 * zeroToNine) + (10 * tenToNineNine) + (100 * hundredToNineNineNine);

}

component main = Q6();

/* 
INPUT = {"in":999} 
*/

//output: 100
```
//----------------------------------------------------------------------

7. If `in` is equal to 5, return 10. If `in` is equal to 7, return 62. If `in` is equal to 8, return 72. Reject all other inputs.
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

//7. If `in` is equal to 5, return 10. If `in` is equal to 7, return 62. 
//   If `in` is equal to 8, return 72. Reject all other inputs.
template Q7 () {
    signal input in;
    signal output out;

    signal isEq5 <== IsEqual()([in, 5]);
    signal isEq7 <== IsEqual()([in, 7]);
    signal isEq8 <== IsEqual()([in, 8]);

    1 === isEq5 + isEq7 + isEq8;

    out <== (10 * isEq5) + (62 * isEq7) + (72 * isEq8);

}

component main = Q7();

/* 
INPUT = {"in":9} 
*/
```
//----------------------------------------------------------------------

8. If `in` is less than 9, set `out` to 4. If `in` is equal to 16, set out to be 18. If `in` is greater than 91, set out to be 104. Reject all other inputs.
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

// 8. If `in` is less than 9, set `out` to 4. If `in` is equal to 16, set out to be 18. 
//    If `in` is greater than 91, set out to be 104. Reject all other inputs.
template Q8 () {
    signal input in;
    signal output out;

    var n = 252;

    component lt9 = LessThan(n);
    component eq16 = IsEqual();
    component gt91 = GreaterThan(n);

    lt9.in[0] <== in;
    lt9.in[1] <== 9;

    eq16.in[0] <== in;
    eq16.in[1] <== 16;

    gt91.in[0] <== in;
    gt91.in[1] <== 91;

    1 === lt9.out + eq16.out + gt91.out;

    out <== (4 * lt9.out) + (18 * eq16.out) + (104 * gt91.out);

}

component main = Q8();

/* 
INPUT = {"in":92} 
*/
```
//----------------------------------------------------------------------

9. If `in` is in the interval [0, 9], set `out` to be 5. If `in` is in the interval [16, 25], set `out` to be 9. If `in` is in the interval [36-40] set `out` to be 12. If it has any other value, set `out` to be 1.
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

// 9. If `in` is in the interval [0, 9], set `out` to be 5. If `in` is in the interval [16, 25], 
//    set `out` to be 9. If `in` is in the interval [36-40] set `out` to be 12. If it has any 
//    other value, set `out` to be 1.
template Q9 () {
    signal input in;
    signal output out;

    var n = 252;

    signal gte0 <== GreaterEqThan(n)([in, 0]);
    signal lte9 <== LessEqThan(n)([in, 9]);
    
    signal gte16 <== GreaterEqThan(n)([in, 16]);
    signal lte25 <== LessEqThan(n)([in, 25]);

    signal gte36 <== GreaterEqThan(n)([in, 36]);
    signal lte40 <== LessEqThan(n)([in, 40]);

    signal zeroToNine <== gte0 * lte9;
    signal sixteenToTwentyFive <== gte16 * lte25;
    signal thirtysixToForty <== gte36 * lte40;

    // (only 0 or 1 here)
    signal validRange <== zeroToNine + sixteenToTwentyFive + thirtysixToForty;

    out <== (5 * zeroToNine) + (9 * sixteenToTwentyFive) + (12 * thirtysixToForty)
            + (1 - validRange);
}

component main = Q9();

/* 
INPUT = {"in":41} 
*/
```
//----------------------------------------------------------------------

10. If `in` equals 10, set `out` to be 7. If `in` equals 19, set `out` to be 13. If `in` equals 21, set `out` to be 20. For all other values, set `out` to be 61.
```circom
pragma circom 2.1.6;

include "circomlib/poseidon.circom";
include "circomlib/comparators.circom";

// 10. If `in` equals 10, set `out` to be 7. If `in` equals 19, set `out` to be 13. 
//     If `in` equals 21, set `out` to be 20. For all other values, set `out` to be 61.
template Q9 () {
    signal input in;
    signal output out;

    var n = 252;

    signal isEq10 <== IsEqual()([in, 10]);
    signal isEq19 <== IsEqual()([in, 19]);
    signal isEq21 <== IsEqual()([in, 21]);

    // only 0 or 1 here
    signal validRange <== isEq10 + isEq19 + isEq21;

    out <== (7 * isEq10) + (13 * isEq19) + (20 * isEq21) + (61 * (1 - validRange));
}

component main = Q9();

/* 
INPUT = {"in":21} 
*/
```
//----------------------------------------------------------------------