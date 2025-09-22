pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template NullifierHash() {
    signal input secret;
    signal input nullifier;
    signal output hash; // public
    
    // Hash the secret and nullifier using Poseidon
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== secret;
    poseidon.inputs[1] <== nullifier;
    
    hash <== poseidon.out;
}

component main { public [nullifier] } = NullifierHash();