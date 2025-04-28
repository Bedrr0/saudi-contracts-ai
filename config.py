"""
Configuration settings for the Saudi AI Contracts system.
"""

import os

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Contract types
CONTRACT_TYPES = {
    "employment": "Employment Contract",
    "rental": "Rental Contract",
    "sales": "Sales Contract",
    "partnership": "Partnership Contract"
}

# Legal references
LEGAL_REFERENCES = {
    "employment": {
        "labor_law": os.path.join(BASE_DIR, "..", "organized_legal_content", "employment", "labor_law_key_articles.md"),
        "unified_work_document": os.path.join(BASE_DIR, "..", "organized_legal_content", "employment", "unified_work_document_key_regulations.md")
    },
    "rental": {
        "ejar": os.path.join(BASE_DIR, "..", "organized_legal_content", "rental", "ejar_key_regulations.md"),
        "enforcement_system": os.path.join(BASE_DIR, "..", "organized_legal_content", "rental", "enforcement_system_key_regulations.md")
    },
    "sales": {
        "vat": os.path.join(BASE_DIR, "..", "organized_legal_content", "sales", "vat_key_regulations.md"),
        "enforcement_system": os.path.join(BASE_DIR, "..", "organized_legal_content", "sales", "enforcement_system_key_regulations.md")
    },
    "partnership": {
        "companies_law": os.path.join(BASE_DIR, "..", "organized_legal_content", "partnership", "companies_law_key_regulations.md"),
        "anti_concealment": os.path.join(BASE_DIR, "..", "organized_legal_content", "partnership", "anti_concealment_key_regulations.md")
    }
}

# Risk levels
RISK_LEVELS = {
    "high": "High Risk",
    "medium": "Medium Risk",
    "low": "Low Risk",
    "none": "No Risk"
}

# NLP settings
NLP_SETTINGS = {
    "language_detection": {
        "arabic": ["ar", "arabic", "العربية"],
        "english": ["en", "english", "الإنجليزية"]
    },
    "tokenization": {
        "use_nltk": True,
        "min_token_length": 2
    },
    "section_markers": {
        "arabic": ["المادة", "البند", "الفقرة", "الفصل"],
        "english": ["article", "section", "clause", "chapter"]
    }
}

# Report settings
REPORT_SETTINGS = {
    "output_format": "html",  # Options: pdf, html, txt
    "language": "en"  # Options: en, ar
}

# API settings
API_SETTINGS = {
    "host": "0.0.0.0",
    "port": 5000,
    "debug": True,
    "allowed_file_types": ["pdf", "docx", "txt"]
}
