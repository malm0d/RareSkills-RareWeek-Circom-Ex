pragma circom 2.0.0;

template RotateLeft(n, r) {
    signal input arr[n];
    signal output rotated[n];
    
    // Constraint: rotated[i] === arr[(i + r) % n] for all i
    // This rotates the array left by r positions

    for (var i = 0; i < n; i++) {
        rotated[i] <== arr[(i + r) % n];
    }
}

component main = RotateLeft(8, 1);
