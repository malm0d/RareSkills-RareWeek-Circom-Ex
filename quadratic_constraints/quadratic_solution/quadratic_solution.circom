pragma circom 2.0.0;

template QuadraticSolution() {
    signal input x;

    signal v1;
    
    // Constrain x to be the solution to 2x^2 + 5x = 0
    // This can be factored as x(2x + 5) = 0
    // So x = 0 or x = -5/2 = -2.5

    v1 <-- 2 * x * x;
    v1 + (5 * x) === 0;
}

component main = QuadraticSolution();