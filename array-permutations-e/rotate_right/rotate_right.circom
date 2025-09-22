pragma circom 2.0.0;

template RotateRight(n, r) {
    signal input arr[n];
    signal output rotated[n];
    
    // Constraint: rotated[i] === arr[(i - r + n) % n] for all i
    // This rotates the array right by r positions
    // For right rotation by r, element at position i comes from position (i - r + n) % n
    for (var i = 0; i < n; i++) {
        rotated[i] <== arr[(i - r + n) % n];
    }
}

component main = RotateRight(8, 1);
