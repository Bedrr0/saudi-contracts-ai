"""
Integration module for the Saudi AI Contracts system.
"""

import os
import logging
from src.validation_rules import ValidationRules
from src.analyzer import ContractAnalyzer

# Configure logging
logger = logging.getLogger(__name__)

class ContractValidator:
    """
    Validator for integrating validation rules with the contract analyzer.
    """
    
    def __init__(self):
        """Initialize the contract validator."""
        logger.info("Initializing ContractValidator")
        self.analyzer = ContractAnalyzer()
    
    def validate(self, contract_data, contract_type):
        """
        Validate a contract against Saudi legal requirements.
        
        Args:
            contract_data (dict): Parsed contract data
            contract_type (str): Type of contract
            
        Returns:
            dict: Validation results
        """
        logger.info(f"Validating {contract_type} contract")
        
        # Get contract text and sections
        contract_text = contract_data["text"]
        contract_sections = contract_data["sections"]
        
        # Apply validation rules based on contract type
        validation_results = []
        
        if contract_type == "employment":
            validation_results = ValidationRules.validate_employment_contract(contract_text, contract_sections)
        elif contract_type == "rental":
            validation_results = ValidationRules.validate_rental_contract(contract_text, contract_sections)
        elif contract_type == "sales":
            validation_results = ValidationRules.validate_sales_contract(contract_text, contract_sections)
        elif contract_type == "partnership":
            validation_results = ValidationRules.validate_partnership_contract(contract_text, contract_sections)
        else:
            logger.warning(f"No specific validation rules for contract type: {contract_type}")
        
        # Analyze the contract using the analyzer
        analysis_results = self.analyzer.analyze(contract_data, contract_type)
        
        # Integrate validation results with analysis results
        for result in validation_results:
            if result["type"] == "missing_element":
                analysis_results["missing_clauses"].append({
                    "clause": result["element"],
                    "description": result["description"],
                    "risk_level": "high" if result["severity"] == "high" else "medium"
                })
            elif result["type"] == "illegal_provision":
                analysis_results["violations"].append({
                    "rule": result["element"],
                    "description": result["description"],
                    "risk_level": "high" if result["severity"] == "high" else "medium",
                    "reference": result["article"]
                })
            elif result["type"] == "incomplete_provision" or result["type"] == "potential_violation":
                analysis_results["risks"].append({
                    "rule": result["element"],
                    "description": result["description"],
                    "risk_level": "high" if result["severity"] == "high" else "medium",
                    "reference": result["article"]
                })
        
        # Generate recommendations based on validation results
        for result in validation_results:
            if result["type"] == "missing_element":
                analysis_results["recommendations"].append(f"Add {result['element']} to the contract")
            elif result["type"] == "illegal_provision":
                analysis_results["recommendations"].append(f"Modify {result['element']} to comply with {result['article']}")
            elif result["type"] == "incomplete_provision":
                analysis_results["recommendations"].append(f"Complete {result['element']} by adding required information")
            elif result["type"] == "potential_violation":
                analysis_results["recommendations"].append(f"Review {result['element']} for compliance with {result['article']}")
        
        # Recalculate compliance score
        total_issues = (
            len(analysis_results["violations"]) + 
            len(analysis_results["missing_clauses"]) + 
            len(analysis_results["risks"])
        )
        
        # Base score is 100, deduct points for issues
        base_score = 100
        deduction_per_violation = 10
        deduction_per_missing = 5
        deduction_per_risk = 3
        
        compliance_score = base_score - (
            len(analysis_results["violations"]) * deduction_per_violation +
            len(analysis_results["missing_clauses"]) * deduction_per_missing +
            len(analysis_results["risks"]) * deduction_per_risk
        )
        
        # Ensure score is between 0 and 100
        analysis_results["compliance_score"] = max(0, min(100, compliance_score))
        
        return analysis_results
