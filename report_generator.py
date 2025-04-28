"""
Report generator module for the Saudi AI Contracts system.
"""

import os
import logging
from datetime import datetime
import json
import markdown
import pdfkit
from jinja2 import Template

from src.config import REPORT_SETTINGS

# Configure logging
logger = logging.getLogger(__name__)

class ReportGenerator:
    """
    Generator for creating analysis reports in various formats.
    """
    
    def __init__(self):
        """Initialize the report generator."""
        logger.info("Initializing ReportGenerator")
        self.templates_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates")
        
        # Create templates directory if it doesn't exist
        if not os.path.exists(self.templates_dir):
            os.makedirs(self.templates_dir)
            self._create_default_templates()
    
    def _create_default_templates(self):
        """Create default report templates."""
        # HTML template
        html_template = """<!DOCTYPE html>
<html dir="{{ 'rtl' if language == 'ar' else 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            direction: {{ 'rtl' if language == 'ar' else 'ltr' }};
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .section {
            margin-bottom: 30px;
        }
        h1 {
            color: #2c3e50;
        }
        h2 {
            color: #3498db;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        h3 {
            color: #2980b9;
        }
        .summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .risk-high {
            color: #e74c3c;
        }
        .risk-medium {
            color: #f39c12;
        }
        .risk-low {
            color: #27ae60;
        }
        .risk-none {
            color: #2ecc71;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
            text-align: {{ 'right' if language == 'ar' else 'left' }};
        }
        th {
            background-color: #f2f2f2;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        .compliance-score {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .score-high {
            color: #27ae60;
        }
        .score-medium {
            color: #f39c12;
        }
        .score-low {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <p>{{ generated_date }}</p>
        </div>
        
        <div class="section summary">
            <h2>{{ summary_title }}</h2>
            <p>{{ contract_type_label }}: <strong>{{ contract_type }}</strong></p>
            <p>{{ file_label }}: <strong>{{ file_name }}</strong></p>
            
            <div class="compliance-score {{ 'score-high' if compliance_score >= 80 else 'score-medium' if compliance_score >= 60 else 'score-low' }}">
                {{ compliance_label }}: {{ compliance_score }}%
            </div>
        </div>
        
        {% if violations %}
        <div class="section">
            <h2>{{ violations_title }}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{{ rule_label }}</th>
                        <th>{{ description_label }}</th>
                        <th>{{ risk_level_label }}</th>
                        <th>{{ reference_label }}</th>
                    </tr>
                </thead>
                <tbody>
                    {% for violation in violations %}
                    <tr>
                        <td>{{ violation.rule }}</td>
                        <td>{{ violation.description }}</td>
                        <td class="risk-{{ violation.risk_level }}">{{ risk_levels[violation.risk_level] }}</td>
                        <td>{{ violation.reference }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}
        
        {% if missing_clauses %}
        <div class="section">
            <h2>{{ missing_clauses_title }}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{{ clause_label }}</th>
                        <th>{{ description_label }}</th>
                        <th>{{ risk_level_label }}</th>
                    </tr>
                </thead>
                <tbody>
                    {% for clause in missing_clauses %}
                    <tr>
                        <td>{{ clause.clause }}</td>
                        <td>{{ clause.description }}</td>
                        <td class="risk-{{ clause.risk_level }}">{{ risk_levels[clause.risk_level] }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}
        
        {% if risks %}
        <div class="section">
            <h2>{{ risks_title }}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{{ rule_label }}</th>
                        <th>{{ description_label }}</th>
                        <th>{{ risk_level_label }}</th>
                        <th>{{ reference_label }}</th>
                    </tr>
                </thead>
                <tbody>
                    {% for risk in risks %}
                    <tr>
                        <td>{{ risk.rule }}</td>
                        <td>{{ risk.description }}</td>
                        <td class="risk-{{ risk.risk_level }}">{{ risk_levels[risk.risk_level] }}</td>
                        <td>{{ risk.reference }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
        {% endif %}
        
        {% if recommendations %}
        <div class="section">
            <h2>{{ recommendations_title }}</h2>
            <ul>
                {% for recommendation in recommendations %}
                <li>{{ recommendation }}</li>
                {% endfor %}
            </ul>
        </div>
        {% endif %}
        
        <div class="footer">
            <p>{{ footer_text }}</p>
        </div>
    </div>
</body>
</html>
"""
        
        with open(os.path.join(self.templates_dir, "report_template.html"), "w", encoding="utf-8") as f:
            f.write(html_template)
    
    def generate(self, contract_data, analysis_results, contract_type, output_format="pdf"):
        """
        Generate an analysis report.
        
        Args:
            contract_data (dict): Parsed contract data
            analysis_results (dict): Analysis results
            contract_type (str): Type of contract
            output_format (str): Output format (pdf, html, or txt)
            
        Returns:
            str: Path to the generated report
        """
        logger.info(f"Generating {output_format} report for {contract_type} contract")
        
        # Create output directory
        output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Generate report filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = os.path.basename(contract_data["file_path"])
        report_name = f"report_{contract_type}_{timestamp}"
        
        # Prepare template data
        template_data = self._prepare_template_data(contract_data, analysis_results, contract_type)
        
        # Generate report based on format
        if output_format == "pdf":
            report_path = self._generate_pdf_report(template_data, report_name, output_dir)
        elif output_format == "html":
            report_path = self._generate_html_report(template_data, report_name, output_dir)
        elif output_format == "txt":
            report_path = self._generate_txt_report(template_data, report_name, output_dir)
        else:
            logger.error(f"Unsupported output format: {output_format}")
            raise ValueError(f"Unsupported output format: {output_format}")
        
        return report_path
    
    def _prepare_template_data(self, contract_data, analysis_results, contract_type):
        """
        Prepare data for the report template.
        
        Args:
            contract_data (dict): Parsed contract data
            analysis_results (dict): Analysis results
            contract_type (str): Type of contract
            
        Returns:
            dict: Template data
        """
        # Determine language
        language = REPORT_SETTINGS["language"]
        
        # Prepare labels based on language
        if language == "ar":
            labels = {
                "title": "تقرير تحليل العقد",
                "summary_title": "ملخص التحليل",
                "contract_type_label": "نوع العقد",
                "file_label": "الملف",
                "compliance_label": "نسبة الامتثال",
                "violations_title": "المخالفات",
                "missing_clauses_title": "البنود المفقودة",
                "risks_title": "المخاطر",
                "recommendations_title": "التوصيات",
                "rule_label": "القاعدة",
                "description_label": "الوصف",
                "risk_level_label": "مستوى المخاطرة",
                "reference_label": "المرجع",
                "clause_label": "البند",
                "footer_text": "تم إنشاء هذا التقرير بواسطة نظام العقود الذكي السعودي",
                "generated_date": f"تم إنشاؤه في {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            }
            
            # Contract types in Arabic
            contract_types_ar = {
                "employment": "عقد عمل",
                "rental": "عقد إيجار",
                "sales": "عقد بيع",
                "partnership": "عقد شراكة"
            }
            
            # Risk levels in Arabic
            risk_levels_ar = {
                "high": "مخاطرة عالية",
                "medium": "مخاطرة متوسطة",
                "low": "مخاطرة منخفضة",
                "none": "لا توجد مخاطرة"
            }
            
            contract_type_display = contract_types_ar.get(contract_type, contract_type)
            risk_levels = risk_levels_ar
            
        else:  # English
            labels = {
                "title": "Contract Analysis Report",
                "summary_title": "Analysis Summary",
                "contract_type_label": "Contract Type",
                "file_label": "File",
                "compliance_label": "Compliance Score",
                "violations_title": "Violations",
                "missing_clauses_title": "Missing Clauses",
                "risks_title": "Risks",
                "recommendations_title": "Recommendations",
                "rule_label": "Rule",
                "description_label": "Description",
                "risk_level_label": "Risk Level",
                "reference_label": "Reference",
                "clause_label": "Clause",
                "footer_text": "This report was generated by the Saudi AI Contracts system",
                "generated_date": f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            }
            
            contract_type_display = contract_type
            risk_levels = {
                "high": "High Risk",
                "medium": "Medium Risk",
                "low": "Low Risk",
                "none": "No Risk"
            }
        
        # Combine all data
        template_data = {
            **labels,
            "contract_type": contract_type_display,
            "file_name": os.path.basename(contract_data["file_path"]),
            "compliance_score": analysis_results["compliance_score"],
            "violations": analysis_results["violations"],
            "missing_clauses": analysis_results["missing_clauses"],
            "risks": analysis_results["risks"],
            "recommendations": analysis_results["recommendations"],
            "risk_levels": risk_levels,
            "language": language
        }
        
        return template_data
    
    def _generate_html_report(self, template_data, report_name, output_dir):
        """
        Generate an HTML report.
        
        Args:
            template_data (dict): Template data
            report_name (str): Report name
            output_dir (str): Output directory
            
        Returns:
            str: Path to the generated report
        """
        # Load HTML template
        template_path = os.path.join(self.templates_dir, "report_template.html")
        with open(template_path, "r", encoding="utf-8") as f:
            template_content = f.read()
        
        # Render template
        template = Template(template_content)
        html_content = template.render(**template_data)
        
        # Save HTML report
        report_path = os.path.join(output_dir, f"{report_name}.html")
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        return report_path
    
    def _generate_pdf_report(self, template_data, report_name, output_dir):
        """
        Generate a PDF report.
        
        Args:
            template_data (dict): Template data
            report_name (str): Report name
            output_dir (str): Output directory
            
        Returns:
            str: Path to the generated report
        """
        # First generate HTML
        html_path = self._generate_html_report(template_data, report_name, output_dir)
        
        # Convert HTML to PDF
        pdf_path = os.path.join(output_dir, f"{report_name}.pdf")
        
        try:
            # Try to use pdfkit (wkhtmltopdf)
            pdfkit.from_file(html_path, pdf_path)
        except Exception as e:
            logger.warning(f"Failed to generate PDF with pdfkit: {str(e)}")
            logger.info("Falling back to HTML report")
            return html_path
        
        return pdf_path
    
    def _generate_txt_report(self, template_data, report_name, output_dir):
        """
        Generate a text report.
        
        Args:
            template_data (dict): Template data
            report_name (str): Report name
            output_dir (str): Output directory
            
        Returns:
            str: Path to the generated report
        """
        # Create text report content
        lines = []
        
        # Title and summary
        lines.append(template_data["title"].upper())
        lines.append("=" * len(template_data["title"]))
        lines.append("")
        lines.append(template_data["generated_date"])
        lines.append("")
        lines.append(template_data["summary_title"])
        lines.append("-" * len(template_data["summary_title"]))
        lines.append(f"{template_data['contract_ty
(Content truncated due to size limit. Use line ranges to read in chunks)