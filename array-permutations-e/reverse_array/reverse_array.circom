pragma circom 2.0.0;

template ReverseArray(n) {
    signal input arr[n];
    signal output reversed[n];
    
    // Constraint: reversed[i] === arr[n-1-i] for all i
    for (var i = 0; i < n; i++) {
        reversed[i] <== arr[n-1-i];
    }
}

component main = ReverseArray(8);
