#!/bin/bash

# Test script for the Saudi AI Contracts system
# This script tests the system with sample contracts

# Set up environment
cd /home/ubuntu/saudi_ai_contracts

# Create directories if they don't exist
mkdir -p reports
mkdir -p logs

# Install required dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Function to run a test
run_test() {
    contract_type=$1
    contract_file=$2
    
    echo "Testing $contract_type contract: $contract_file"
    
    # Run the analysis
    python -m src.main "$contract_file" --type "$contract_type"
    
    # Check the result
    if [ $? -eq 0 ]; then
        echo "✅ Test passed for $contract_type contract"
    else
        echo "❌ Test failed for $contract_type contract"
    fi
    
    echo "----------------------------------------"
}

# Run tests for each contract type
echo "Starting tests..."
echo "----------------------------------------"

run_test "employment" "sample_contracts/employment_contract_sample.txt"
run_test "rental" "sample_contracts/rental_contract_sample.txt"
run_test "sales" "sample_contracts/sales_contract_sample.txt"
run_test "partnership" "sample_contracts/partnership_contract_sample.txt"

echo "All tests completed."
