"""
Main module for the Saudi AI Contracts system.
"""

import os
import sys
import logging
from datetime import datetime

# Add the project directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import CONTRACT_TYPES, REPORT_SETTINGS
from src.contract_parser import ContractParser
from src.validator import ContractValidator
from src.report_generator import ReportGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("saudi_ai_contracts.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class SaudiAIContracts:
    """
    Main class for the Saudi AI Contracts system.
    """
    
    def __init__(self):
        """Initialize the Saudi AI Contracts system."""
        logger.info("Initializing Saudi AI Contracts system")
        self.parser = ContractParser()
        self.validator = ContractValidator()
        self.report_generator = ReportGenerator()
    
    def analyze_contract(self, contract_path, contract_type=None):
        """
        Analyze a contract document and generate a report.
        
        Args:
            contract_path (str): Path to the contract document
            contract_type (str, optional): Type of contract. If None, will be auto-detected.
            
        Returns:
            dict: Analysis results including risks and violations
        """
        logger.info(f"Analyzing contract: {contract_path}")
        
        # Check if file exists
        if not os.path.exists(contract_path):
            logger.error(f"Contract file not found: {contract_path}")
            raise FileNotFoundError(f"Contract file not found: {contract_path}")
        
        # Parse the contract
        contract_data = self.parser.parse(contract_path)
        
        # Auto-detect contract type if not provided
        if contract_type is None:
            contract_type = self.parser.detect_contract_type(contract_data)
            logger.info(f"Auto-detected contract type: {contract_type}")
        
        # Validate contract type
        if contract_type not in CONTRACT_TYPES:
            logger.error(f"Invalid contract type: {contract_type}")
            raise ValueError(f"Invalid contract type: {contract_type}. Supported types: {list(CONTRACT_TYPES.keys())}")
        
        # Validate the contract
        analysis_results = self.validator.validate(contract_data, contract_type)
        
        # Generate report
        report_path = self.report_generator.generate(
            contract_data, 
            analysis_results, 
            contract_type,
            output_format=REPORT_SETTINGS["output_format"]
        )
        
        logger.info(f"Analysis completed. Report generated at: {report_path}")
        
        return {
            "contract_type": contract_type,
            "analysis_results": analysis_results,
            "report_path": report_path
        }

def main():
    """Main entry point for the command line interface."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Saudi AI Contracts - Contract Analysis System")
    parser.add_argument("contract_path", help="Path to the contract document")
    parser.add_argument("--type", choices=CONTRACT_TYPES.keys(), help="Type of contract")
    parser.add_argument("--output", help="Output directory for the report")
    
    args = parser.parse_args()
    
    try:
        system = SaudiAIContracts()
        results = system.analyze_contract(args.contract_path, args.type)
        print(f"Analysis completed successfully. Report saved to: {results['report_path']}")
    except Exception as e:
        logger.error(f"Error analyzing contract: {str(e)}")
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
