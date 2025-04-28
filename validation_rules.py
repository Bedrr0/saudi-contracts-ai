"""
Validation rules module for the Saudi AI Contracts system.
"""

import re
import logging
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

class ValidationRules:
    """
    Validation rules for different contract types based on Saudi laws.
    """
    
    @staticmethod
    def validate_employment_contract(contract_text, contract_sections):
        """
        Validate employment contract against Saudi Labor Law.
        
        Args:
            contract_text (str): Full contract text
            contract_sections (dict): Contract sections
            
        Returns:
            list: Validation results
        """
        results = []
        
        # Check for required elements
        required_elements = [
            {
                "name": "employee_details",
                "keywords": ["employee name", "employee id", "اسم الموظف", "رقم هوية الموظف"],
                "description": "Employee personal details",
                "article": "Labor Law Article 8"
            },
            {
                "name": "employer_details",
                "keywords": ["employer name", "company name", "اسم صاحب العمل", "اسم الشركة"],
                "description": "Employer details",
                "article": "Labor Law Article 8"
            },
            {
                "name": "job_title",
                "keywords": ["job title", "position", "المسمى الوظيفي", "الوظيفة"],
                "description": "Job title and description",
                "article": "Labor Law Article 8"
            },
            {
                "name": "salary",
                "keywords": ["salary", "wage", "compensation", "راتب", "أجر"],
                "description": "Salary amount",
                "article": "Labor Law Article 8"
            },
            {
                "name": "work_location",
                "keywords": ["work location", "workplace", "مكان العمل", "موقع العمل"],
                "description": "Work location",
                "article": "Labor Law Article 8"
            },
            {
                "name": "contract_duration",
                "keywords": ["contract duration", "term", "مدة العقد", "فترة العقد"],
                "description": "Contract duration",
                "article": "Labor Law Article 8"
            }
        ]
        
        for element in required_elements:
            found = False
            for keyword in element["keywords"]:
                if keyword in contract_text.lower():
                    found = True
                    break
            
            if not found:
                results.append({
                    "type": "missing_element",
                    "element": element["name"],
                    "description": f"Missing required element: {element['description']}",
                    "article": element["article"],
                    "severity": "high"
                })
        
        # Validate working hours
        if "working hours" in contract_text.lower() or "ساعات العمل" in contract_text.lower():
            hours_pattern = r'(\d+)\s*(?:hours|hour|ساعة|ساعات)'
            hours_match = re.search(hours_pattern, contract_text.lower())
            
            if hours_match:
                hours = int(hours_match.group(1))
                if hours > 8:
                    results.append({
                        "type": "illegal_provision",
                        "element": "working_hours",
                        "description": f"Working hours ({hours}) exceed the legal limit of 8 hours per day",
                        "article": "Labor Law Article 77",
                        "severity": "high"
                    })
        else:
            results.append({
                "type": "missing_element",
                "element": "working_hours",
                "description": "Working hours not specified",
                "article": "Labor Law Article 77",
                "severity": "medium"
            })
        
        # Validate probation period
        probation_pattern = r'(?:probation|trial|تجربة|اختبار).*?(\d+)\s*(?:days|day|months|month|يوم|أيام|شهر|أشهر)'
        probation_match = re.search(probation_pattern, contract_text.lower())
        
        if probation_match:
            period = int(probation_match.group(1))
            unit = probation_match.group(2).lower() if len(probation_match.groups()) > 1 else ""
            
            if ('month' in unit or 'شهر' in unit) and period > 3:
                results.append({
                    "type": "illegal_provision",
                    "element": "probation_period",
                    "description": f"Probation period ({period} months) exceeds the legal limit of 3 months",
                    "article": "Labor Law Articles 74-75",
                    "severity": "high"
                })
            elif ('day' in unit or 'يوم' in unit) and period > 90:
                results.append({
                    "type": "illegal_provision",
                    "element": "probation_period",
                    "description": f"Probation period ({period} days) exceeds the legal limit of 90 days",
                    "article": "Labor Law Articles 74-75",
                    "severity": "high"
                })
        
        # Validate annual leave
        leave_pattern = r'(?:annual leave|vacation|إجازة سنوية).*?(\d+)\s*(?:days|day|يوم|أيام)'
        leave_match = re.search(leave_pattern, contract_text.lower())
        
        if leave_match:
            days = int(leave_match.group(1))
            if days < 21:
                results.append({
                    "type": "illegal_provision",
                    "element": "annual_leave",
                    "description": f"Annual leave ({days} days) is less than the legal minimum of 21 days",
                    "article": "Labor Law Article 84",
                    "severity": "high"
                })
        else:
            results.append({
                "type": "missing_element",
                "element": "annual_leave",
                "description": "Annual leave entitlement not specified",
                "article": "Labor Law Article 84",
                "severity": "medium"
            })
        
        # Validate non-compete clause
        if "non-compete" in contract_text.lower() or "عدم المنافسة" in contract_text.lower():
            # Check for excessive duration
            duration_pattern = r'(?:non-compete|عدم المنافسة).*?(\d+)\s*(?:years|year|سنة|سنوات)'
            duration_match = re.search(duration_pattern, contract_text.lower())
            
            if duration_match and int(duration_match.group(1)) > 2:
                results.append({
                    "type": "illegal_provision",
                    "element": "non_compete",
                    "description": f"Non-compete clause duration ({int(duration_match.group(1))} years) exceeds the legal limit of 2 years",
                    "article": "Labor Law Article 83",
                    "severity": "medium"
                })
        
        return results
    
    @staticmethod
    def validate_rental_contract(contract_text, contract_sections):
        """
        Validate rental contract against Ejar regulations.
        
        Args:
            contract_text (str): Full contract text
            contract_sections (dict): Contract sections
            
        Returns:
            list: Validation results
        """
        results = []
        
        # Check for required elements
        required_elements = [
            {
                "name": "landlord_details",
                "keywords": ["landlord", "lessor", "المؤجر", "صاحب العقار"],
                "description": "Landlord details",
                "article": "Ejar Regulations"
            },
            {
                "name": "tenant_details",
                "keywords": ["tenant", "lessee", "المستأجر", "المستفيد"],
                "description": "Tenant details",
                "article": "Ejar Regulations"
            },
            {
                "name": "property_description",
                "keywords": ["property description", "premises", "وصف العقار", "المأجور"],
                "description": "Property description",
                "article": "Ejar Regulations"
            },
            {
                "name": "rent_amount",
                "keywords": ["rent amount", "rental value", "قيمة الإيجار", "مبلغ الإيجار"],
                "description": "Rent amount",
                "article": "Ejar Regulations"
            },
            {
                "name": "contract_duration",
                "keywords": ["duration", "term", "مدة العقد", "فترة الإيجار"],
                "description": "Contract duration",
                "article": "Ejar Regulations"
            },
            {
                "name": "payment_terms",
                "keywords": ["payment terms", "شروط الدفع", "طريقة السداد"],
                "description": "Payment terms",
                "article": "Ejar Regulations"
            }
        ]
        
        for element in required_elements:
            found = False
            for keyword in element["keywords"]:
                if keyword in contract_text.lower():
                    found = True
                    break
            
            if not found:
                results.append({
                    "type": "missing_element",
                    "element": element["name"],
                    "description": f"Missing required element: {element['description']}",
                    "article": element["article"],
                    "severity": "high"
                })
        
        # Check for Ejar registration
        if "ejar" not in contract_text.lower() and "إيجار" not in contract_text:
            results.append({
                "type": "missing_element",
                "element": "ejar_registration",
                "description": "No mention of Ejar registration which is mandatory for all rental contracts",
                "article": "Ejar Regulations",
                "severity": "high"
            })
        
        # Check for security deposit
        deposit_pattern = r'(?:security deposit|damage deposit|تأمين|ضمان).*?(\d+)%'
        deposit_match = re.search(deposit_pattern, contract_text.lower())
        
        if deposit_match:
            percentage = int(deposit_match.group(1))
            if percentage > 10:
                results.append({
                    "type": "illegal_provision",
                    "element": "security_deposit",
                    "description": f"Security deposit ({percentage}%) exceeds the legal limit of 10% of annual rent",
                    "article": "Ejar Regulations",
                    "severity": "medium"
                })
        
        # Check for automatic renewal terms
        if "automatic renewal" in contract_text.lower() or "تجديد تلقائي" in contract_text.lower():
            if "notice" not in contract_text.lower() and "إشعار" not in contract_text.lower():
                results.append({
                    "type": "incomplete_provision",
                    "element": "automatic_renewal",
                    "description": "Automatic renewal clause does not specify notice period for non-renewal",
                    "article": "Ejar Regulations",
                    "severity": "medium"
                })
        
        return results
    
    @staticmethod
    def validate_sales_contract(contract_text, contract_sections):
        """
        Validate sales contract against VAT regulations.
        
        Args:
            contract_text (str): Full contract text
            contract_sections (dict): Contract sections
            
        Returns:
            list: Validation results
        """
        results = []
        
        # Check for required elements
        required_elements = [
            {
                "name": "seller_details",
                "keywords": ["seller", "vendor", "البائع", "المورد"],
                "description": "Seller details",
                "article": "VAT Regulations"
            },
            {
                "name": "buyer_details",
                "keywords": ["buyer", "purchaser", "المشتري", "المستهلك"],
                "description": "Buyer details",
                "article": "VAT Regulations"
            },
            {
                "name": "goods_description",
                "keywords": ["goods description", "product description", "وصف البضاعة", "وصف المنتج"],
                "description": "Description of goods or services",
                "article": "VAT Regulations"
            },
            {
                "name": "price",
                "keywords": ["price", "cost", "سعر", "تكلفة"],
                "description": "Price",
                "article": "VAT Regulations"
            },
            {
                "name": "delivery",
                "keywords": ["delivery", "shipping", "تسليم", "شحن"],
                "description": "Delivery terms",
                "article": "VAT Regulations"
            },
            {
                "name": "payment_terms",
                "keywords": ["payment terms", "شروط الدفع", "طريقة السداد"],
                "description": "Payment terms",
                "article": "VAT Regulations"
            }
        ]
        
        for element in required_elements:
            found = False
            for keyword in element["keywords"]:
                if keyword in contract_text.lower():
                    found = True
                    break
            
            if not found:
                results.append({
                    "type": "missing_element",
                    "element": element["name"],
                    "description": f"Missing required element: {element['description']}",
                    "article": element["article"],
                    "severity": "high"
                })
        
        # Check for VAT disclosure
        if "vat" not in contract_text.lower() and "ضريبة القيمة المضافة" not in contract_text.lower() and "ضريبة" not in contract_text.lower():
            results.append({
                "type": "missing_element",
                "element": "vat_disclosure",
                "description": "No mention of VAT which is mandatory for sales contracts",
                "article": "VAT Regulations",
                "severity": "high"
            })
        
        # Check for VAT registration number
        vat_reg_pattern = r'(?:vat registration|tax registration|الرقم الضريبي|تسجيل ضريبي)\s*(?:number|no|رقم)?\s*:?\s*(\d{15})'
        vat_reg_match = re.search(vat_reg_pattern, contract_text.lower())
        
        if not vat_reg_match:
            results.append({
                "type": "missing_element",
                "element": "vat_registration_number",
                "description": "No VAT registration number provided",
                "article": "VAT Regulations",
                "severity": "medium"
            })
        
        # Check for invoice requirements
        if "invoice" in contract_text.lower() or "فاتورة" in contract_text.lower():
            invoice_requirements = ["date", "number", "description", "price", "vat amount", "total"]
            arabic_requirements = ["تاريخ", "رقم", "وصف", "سعر", "مبلغ الضريبة", "الإجمالي"]
            
            missing_requirements = []
            
            for i, req in enumerate(invoice_requirements):
                if req not in contract_text.lower() and arabic_requirements[i] not in contract_text.lower():
                    missing_requirements.append(req)
            
            if missing_requirements:
                results.append({
                    "type": "incomplete_provision",
                    "element": "invoice_requirements",
                    "description": f"Invoice clause does not specify required elements: {', '.join(missing_re
(Content truncated due to size limit. Use line ranges to read in chunks)