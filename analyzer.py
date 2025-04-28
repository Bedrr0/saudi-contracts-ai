"""
Contract analyzer module for the Saudi AI Contracts system.
"""

import os
import re
import logging
import json
from datetime import datetime

from src.config import LEGAL_REFERENCES, RISK_LEVELS

# Configure logging
logger = logging.getLogger(__name__)

class ContractAnalyzer:
    """
    Analyzer for validating contracts against Saudi legal requirements.
    """
    
    def __init__(self):
        """Initialize the contract analyzer."""
        logger.info("Initializing ContractAnalyzer")
        self.legal_rules = self._load_legal_rules()
    
    def _load_legal_rules(self):
        """
        Load legal rules from the organized legal content.
        
        Returns:
            dict: Legal rules organized by contract type
        """
        legal_rules = {}
        
        for contract_type, references in LEGAL_REFERENCES.items():
            legal_rules[contract_type] = {}
            
            for ref_name, ref_path in references.items():
                try:
                    with open(ref_path, 'r', encoding='utf-8') as file:
                        content = file.read()
                        legal_rules[contract_type][ref_name] = self._extract_rules_from_content(content)
                except Exception as e:
                    logger.error(f"Error loading legal rules from {ref_path}: {str(e)}")
        
        return legal_rules
    
    def _extract_rules_from_content(self, content):
        """
        Extract rules from markdown content.
        
        Args:
            content (str): Markdown content
            
        Returns:
            list: Extracted rules
        """
        rules = []
        
        # Split content by headers
        sections = re.split(r'##\s+', content)
        
        for section in sections:
            if not section.strip():
                continue
                
            # Extract section title and content
            lines = section.strip().split('\n')
            title = lines[0].strip()
            section_content = '\n'.join(lines[1:]).strip()
            
            # Extract rules from bullet points
            bullet_points = re.findall(r'-\s+(.*?)(?:\n|$)', section_content)
            
            for point in bullet_points:
                rules.append({
                    "section": title,
                    "rule": point.strip(),
                    "keywords": self._extract_keywords(point)
                })
        
        return rules
    
    def _extract_keywords(self, text):
        """
        Extract keywords from text for rule matching.
        
        Args:
            text (str): Text to extract keywords from
            
        Returns:
            list: Extracted keywords
        """
        # Remove common words and punctuation
        common_words = {'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'must', 'should', 'can', 'may'}
        
        # Tokenize and filter
        words = re.findall(r'\b\w+\b', text.lower())
        keywords = [word for word in words if word not in common_words and len(word) > 2]
        
        return keywords
    
    def analyze(self, contract_data, contract_type):
        """
        Analyze a contract against legal requirements.
        
        Args:
            contract_data (dict): Parsed contract data
            contract_type (str): Type of contract
            
        Returns:
            dict: Analysis results including risks and violations
        """
        logger.info(f"Analyzing {contract_type} contract")
        
        if contract_type not in self.legal_rules:
            logger.error(f"No legal rules found for contract type: {contract_type}")
            raise ValueError(f"No legal rules found for contract type: {contract_type}")
        
        # Initialize results
        results = {
            "contract_type": contract_type,
            "analysis_date": datetime.now().isoformat(),
            "risks": [],
            "violations": [],
            "compliance_score": 0,
            "missing_clauses": [],
            "recommendations": []
        }
        
        # Get contract text
        contract_text = contract_data["text"].lower()
        contract_sections = contract_data["sections"]
        
        # Check for each legal rule
        rules = []
        for ref_name, ref_rules in self.legal_rules[contract_type].items():
            rules.extend(ref_rules)
        
        # Analyze employment contracts
        if contract_type == "employment":
            self._analyze_employment_contract(contract_text, contract_sections, rules, results)
        
        # Analyze rental contracts
        elif contract_type == "rental":
            self._analyze_rental_contract(contract_text, contract_sections, rules, results)
        
        # Analyze sales contracts
        elif contract_type == "sales":
            self._analyze_sales_contract(contract_text, contract_sections, rules, results)
        
        # Analyze partnership contracts
        elif contract_type == "partnership":
            self._analyze_partnership_contract(contract_text, contract_sections, rules, results)
        
        # Calculate compliance score
        total_rules = len(rules)
        violations = len(results["violations"])
        missing = len(results["missing_clauses"])
        
        if total_rules > 0:
            compliance_score = 100 - ((violations + missing) / total_rules * 100)
            results["compliance_score"] = round(max(0, min(100, compliance_score)), 2)
        
        return results
    
    def _analyze_employment_contract(self, contract_text, contract_sections, rules, results):
        """Analyze employment contract against labor law requirements."""
        
        # Check for required clauses
        required_clauses = [
            {"name": "working_hours", "keywords": ["working hours", "work hours", "ساعات العمل"], 
             "description": "Working hours must be specified and comply with labor law limits"},
            {"name": "salary", "keywords": ["salary", "wage", "compensation", "راتب", "أجر"], 
             "description": "Salary must be clearly stated and meet minimum wage requirements"},
            {"name": "probation", "keywords": ["probation", "trial period", "فترة التجربة", "فترة الاختبار"], 
             "description": "Probation period must be specified and not exceed 90 days"},
            {"name": "leave", "keywords": ["annual leave", "vacation", "إجازة سنوية"], 
             "description": "Annual leave entitlement must be specified and meet minimum requirements"},
            {"name": "termination", "keywords": ["termination", "notice period", "إنهاء العقد", "فترة الإشعار"], 
             "description": "Termination conditions and notice period must be specified"}
        ]
        
        for clause in required_clauses:
            found = False
            for keyword in clause["keywords"]:
                if keyword in contract_text:
                    found = True
                    break
            
            if not found:
                results["missing_clauses"].append({
                    "clause": clause["name"],
                    "description": clause["description"],
                    "risk_level": "high"
                })
                results["recommendations"].append(f"Add a clause specifying {clause['name']}")
        
        # Check for specific violations
        
        # Working hours check
        if "working hours" in contract_text or "ساعات العمل" in contract_text:
            # Look for excessive working hours
            hours_pattern = r'(\d+)\s*(?:hours|hour|ساعة|ساعات)'
            hours_match = re.search(hours_pattern, contract_text)
            
            if hours_match and int(hours_match.group(1)) > 8:
                results["violations"].append({
                    "rule": "Maximum working hours",
                    "description": "Working hours exceed the legal limit of 8 hours per day",
                    "risk_level": "high",
                    "reference": "Labor Law Article 77"
                })
        
        # Probation period check
        probation_pattern = r'(?:probation|trial|تجربة|اختبار).*?(\d+)\s*(?:days|day|months|month|يوم|أيام|شهر|أشهر)'
        probation_match = re.search(probation_pattern, contract_text)
        
        if probation_match:
            period = int(probation_match.group(1))
            unit_match = re.search(r'(\d+)\s*(days|day|months|month|يوم|أيام|شهر|أشهر)', contract_text)
            unit = ""
            
            if unit_match and len(unit_match.groups()) > 1:
                unit = unit_match.group(2).lower()
            
            if ('month' in unit or 'شهر' in unit) and period > 3:
                results["violations"].append({
                    "rule": "Probation period limitation",
                    "description": "Probation period exceeds the legal limit of 90 days",
                    "risk_level": "medium",
                    "reference": "Labor Law Articles 74-75"
                })
            elif ('day' in unit or 'يوم' in unit) and period > 90:
                results["violations"].append({
                    "rule": "Probation period limitation",
                    "description": "Probation period exceeds the legal limit of 90 days",
                    "risk_level": "medium",
                    "reference": "Labor Law Articles 74-75"
                })
        
        # Non-compete clause check
        if "non-compete" in contract_text or "عدم المنافسة" in contract_text:
            # Check for excessive duration
            duration_pattern = r'(?:non-compete|عدم المنافسة).*?(\d+)\s*(?:years|year|سنة|سنوات)'
            duration_match = re.search(duration_pattern, contract_text)
            
            if duration_match and int(duration_match.group(1)) > 2:
                results["violations"].append({
                    "rule": "Non-compete clause duration",
                    "description": "Non-compete clause duration exceeds the legal limit of 2 years",
                    "risk_level": "medium",
                    "reference": "Labor Law Article 83"
                })
    
    def _analyze_rental_contract(self, contract_text, contract_sections, rules, results):
        """Analyze rental contract against Ejar and enforcement system requirements."""
        
        # Check for required clauses
        required_clauses = [
            {"name": "property_description", "keywords": ["property description", "premises", "وصف العقار", "المأجور"], 
             "description": "Property description must be clearly specified"},
            {"name": "rent_amount", "keywords": ["rent amount", "rental value", "قيمة الإيجار", "مبلغ الإيجار"], 
             "description": "Rent amount must be clearly stated"},
            {"name": "contract_duration", "keywords": ["duration", "term", "مدة العقد", "فترة الإيجار"], 
             "description": "Contract duration must be specified"},
            {"name": "payment_terms", "keywords": ["payment terms", "شروط الدفع", "طريقة السداد"], 
             "description": "Payment terms must be clearly specified"},
            {"name": "maintenance", "keywords": ["maintenance", "repairs", "صيانة", "إصلاحات"], 
             "description": "Maintenance responsibilities must be specified"}
        ]
        
        for clause in required_clauses:
            found = False
            for keyword in clause["keywords"]:
                if keyword in contract_text:
                    found = True
                    break
            
            if not found:
                results["missing_clauses"].append({
                    "clause": clause["name"],
                    "description": clause["description"],
                    "risk_level": "high"
                })
                results["recommendations"].append(f"Add a clause specifying {clause['name']}")
        
        # Check for Ejar registration
        if "ejar" not in contract_text.lower() and "إيجار" not in contract_text:
            results["violations"].append({
                "rule": "Ejar registration",
                "description": "No mention of Ejar registration which is mandatory for all rental contracts",
                "risk_level": "high",
                "reference": "Ejar Regulations"
            })
            results["recommendations"].append("Add a clause stating that the contract will be registered in the Ejar platform")
        
        # Check for security deposit
        deposit_pattern = r'(?:security deposit|damage deposit|تأمين|ضمان).*?(\d+)%'
        deposit_match = re.search(deposit_pattern, contract_text)
        
        if deposit_match and int(deposit_match.group(1)) > 10:
            results["violations"].append({
                "rule": "Security deposit limitation",
                "description": "Security deposit exceeds the legal limit of 10% of annual rent",
                "risk_level": "medium",
                "reference": "Ejar Regulations"
            })
        
        # Check for automatic renewal terms
        if "automatic renewal" in contract_text or "تجديد تلقائي" in contract_text:
            if "notice" not in contract_text and "إشعار" not in contract_text:
                results["risks"].append({
                    "rule": "Automatic renewal terms",
                    "description": "Automatic renewal clause does not specify notice period for non-renewal",
                    "risk_level": "medium",
                    "reference": "Ejar Regulations"
                })
                results["recommendations"].append("Specify the notice period required for non-renewal")
    
    def _analyze_sales_contract(self, contract_text, contract_sections, rules, results):
        """Analyze sales contract against VAT and enforcement system requirements."""
        
        # Check for required clauses
        required_clauses = [
            {"name": "goods_description", "keywords": ["goods description", "product description", "وصف البضاعة", "وصف المنتج"], 
             "description": "Description of goods or services must be clearly specified"},
            {"name": "price", "keywords": ["price", "cost", "سعر", "تكلفة"], 
             "description": "Price must be clearly stated"},
            {"name": "delivery", "keywords": ["delivery", "shipping", "تسليم", "شحن"], 
             "description": "Delivery terms must be specified"},
            {"name": "payment_terms", "keywords": ["payment terms", "شروط الدفع", "طريقة السداد"], 
             "description": "Payment terms must be clearly specified"},
            {"name": "warranty", "keywords": ["warranty", "guarantee", "ضمان", "كفالة"], 
             "description": "Warranty terms should be specified"}
        ]
        
        for clause in required_clauses:
            found = False
            for keyword in clause["keywords"]:
                if keyword in contract_text:
                    found = True
                    break
            
            if not found:
                results["missing_clauses"].append({
                    "clause": clause["name"],
                    "description": clause["description"],
                    "risk_level": "high" if clause["name"] != "warranty" else "medium"
                })
                results["recommendations"].append(f"Add a clause specifying {clause['name']}")
        
        # Check for VAT disclosure
        if "vat" not in contract_text.lower() and "ضريبة القيمة المضافة" not in contract_text and "ضريبة" not in contract_text:
            results["violations"].append({
                "rule": "VAT disclosure",
                "description": "No mention of VAT which is mandatory for sales contracts",
                "risk_level": "high",
                "reference": "VAT Regulations"
            })
            results["recommendations"].append("Add a clause stating the VAT amount or e
(Content truncated due to size limit. Use line ranges to read in chunks)