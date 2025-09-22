#!/bin/bash

# Test script for all boolean constraint circuits
# Run from boolean_constraints directory

echo "Testing all boolean constraint circuits..."
echo "========================================="

# Set NODE_PATH to parent's node_modules
export NODE_PATH="../node_modules"

# Array of circuit directories
circuits=("binary_to_decimal" "bitwise_and" "bitwise_not" "bitwise_or" "bitwise_nand" "bitwise_xor")

# Test each circuit
for circuit in "${circuits[@]}"; do
    echo ""
    echo "Testing $circuit..."
    echo "-----------------"
    
    if [ -d "$circuit" ]; then
        cd "$circuit"
        
        # Compile the circuit
        echo "Compiling $circuit..."
        npm run compile
        
        if [ $? -eq 0 ]; then
            # Run tests
            echo "Running tests for $circuit..."
            npm test
            
            if [ $? -eq 0 ]; then
                echo "✅ $circuit tests passed!"
            else
                echo "❌ $circuit tests failed!"
            fi
        else
            echo "❌ $circuit compilation failed!"
        fi
        
        cd ..
    else
        echo "❌ Directory $circuit not found!"
    fi
done

echo ""
echo "========================================="
echo "All tests completed!"