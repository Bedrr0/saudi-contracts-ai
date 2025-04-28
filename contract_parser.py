"""
Modified contract parser module for the Saudi AI Contracts system.
"""

import os
import re
import logging
import PyPDF2
from datetime import datetime
import langdetect
from langdetect import detect
import nltk
from nltk.tokenize import word_tokenize

from src.config import CONTRACT_TYPES, NLP_SETTINGS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ContractParser:
    """
    Parser for extracting and analyzing contract text.
    """
    
    def __init__(self):
        """Initialize the contract parser."""
        logger.info("Initializing ContractParser")
        
        # Ensure NLTK data is available
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
    
    def parse(self, file_path):
        """
        Parse a contract document.
        
        Args:
            file_path (str): Path to the contract document
            
        Returns:
            dict: Parsed contract data
        """
        logger.info(f"Parsing contract: {file_path}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Extract text based on file type
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            contract_text = self._extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            contract_text = self._extract_text_from_docx(file_path)
        elif file_extension == '.txt':
            contract_text = self._extract_text_from_txt(file_path)
        else:
            logger.error(f"Unsupported file type: {file_extension}")
            raise ValueError(f"Unsupported file type: {file_extension}")
        
        # Detect language
        language = self._detect_language(contract_text)
        
        # Extract metadata
        metadata = self._extract_metadata(contract_text, language)
        
        # Segment sections
        sections = self._segment_text(contract_text)
        
        # Return parsed data
        return {
            "file_path": file_path,
            "text": contract_text,
            "language": language,
            "metadata": metadata,
            "sections": sections
        }
    
    def _extract_text_from_pdf(self, file_path):
        """
        Extract text from a PDF file.
        
        Args:
            file_path (str): Path to the PDF file
            
        Returns:
            str: Extracted text
        """
        try:
            text = ""
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise
    
    def _extract_text_from_docx(self, file_path):
        """
        Extract text from a DOCX file.
        
        Args:
            file_path (str): Path to the DOCX file
            
        Returns:
            str: Extracted text
        """
        try:
            import docx
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {str(e)}")
            raise
    
    def _extract_text_from_txt(self, file_path):
        """
        Extract text from a TXT file.
        
        Args:
            file_path (str): Path to the TXT file
            
        Returns:
            str: Extracted text
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
            return text
        except UnicodeDecodeError:
            # Try with different encodings
            encodings = ['latin-1', 'cp1256', 'utf-16']
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as file:
                        text = file.read()
                    return text
                except UnicodeDecodeError:
                    continue
            
            logger.error("Failed to decode text file with multiple encodings")
            raise
        except Exception as e:
            logger.error(f"Error extracting text from TXT: {str(e)}")
            raise
    
    def _detect_language(self, text):
        """
        Detect the language of the contract.
        
        Args:
            text (str): Contract text
            
        Returns:
            str: Detected language code
        """
        try:
            # Use a sample of the text for faster detection
            sample = text[:1000]
            lang = detect(sample)
            
            # Map to our supported languages
            if lang in NLP_SETTINGS["language_detection"]["arabic"]:
                return "ar"
            elif lang in NLP_SETTINGS["language_detection"]["english"]:
                return "en"
            else:
                return lang
        except langdetect.LangDetectException:
            logger.warning("Language detection failed, defaulting to English")
            return "en"
    
    def _extract_metadata(self, text, language):
        """
        Extract metadata from the contract text.
        
        Args:
            text (str): Contract text
            language (str): Detected language
            
        Returns:
            dict: Extracted metadata
        """
        metadata = {
            "date": None,
            "parties": [],
            "contract_type": None
        }
        
        # Extract date
        date_patterns = [
            r'\d{2}/\d{2}/\d{4}',  # DD/MM/YYYY
            r'\d{2}-\d{2}-\d{4}',  # DD-MM-YYYY
            r'\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}',  # DD Month YYYY
            r'\d{1,2}\s+(?:يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)\s+\d{4}'  # DD Arabic Month YYYY
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text)
            if match:
                metadata["date"] = match.group(0)
                break
        
        # Extract parties
        party_patterns = [
            r'(?:between|بين)\s+(.+?)\s+(?:and|و)\s+(.+?)\s+(?:hereinafter|فيما يلي)',
            r'(?:FIRST PARTY|الطرف الأول)[:\s]+(.+?)(?:\n|$)',
            r'(?:SECOND PARTY|الطرف الثاني)[:\s]+(.+?)(?:\n|$)'
        ]
        
        for pattern in party_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                if isinstance(matches[0], tuple):
                    metadata["parties"].extend(list(matches[0]))
                else:
                    metadata["parties"].extend(matches)
        
        return metadata
    
    def _segment_text(self, text):
        """
        Segment the contract text into sections.
        
        Args:
            text (str): Contract text
            
        Returns:
            dict: Segmented sections
        """
        sections = {}
        
        # Simple section detection based on numbering patterns
        section_patterns = [
            r'(\d+\.\s+.+?)(?=\n\d+\.\s+|\Z)',  # 1. Section title
            r'(Article\s+\d+.+?)(?=Article\s+\d+|\Z)',  # Article 1: title
            r'(المادة\s+\d+.+?)(?=المادة\s+\d+|\Z)',  # Arabic Article
            r'(ARTICLE\s+\d+.+?)(?=ARTICLE\s+\d+|\Z)'  # ARTICLE 1: title
        ]
        
        for pattern in section_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches:
                for i, section_text in enumerate(matches):
                    section_title = section_text.split('\n')[0].strip()
                    sections[section_title] = section_text.strip()
                break
        
        # If no sections were found, try to split by newlines and create sections
        if not sections:
            lines = text.split('\n')
            current_section = None
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if this looks like a section header
                if re.match(r'^\d+\.|\bARTICLE\b|\bالمادة\b', line, re.IGNORECASE):
                    current_section = line
                    sections[current_section] = line
                elif current_section:
                    sections[current_section] += '\n' + line
        
        return sections
    
    def detect_contract_type(self, contract_data):
        """
        Detect the type of contract.
        
        Args:
            contract_data (dict): Parsed contract data
            
        Returns:
            str: Detected contract type
        """
        text = contract_data["text"].lower()
        
        # Keywords for each contract type
        keywords = {
            "employment": ["employment", "employee", "employer", "salary", "wage", "working hours", "عمل", "موظف", "راتب", "أجر", "ساعات العمل"],
            "rental": ["rental", "lease", "tenant", "landlord", "property", "premises", "إيجار", "مستأجر", "مؤجر", "عقار", "مبنى"],
            "sales": ["sales", "purchase", "buyer", "seller", "goods", "price", "بيع", "شراء", "مشتري", "بائع", "بضائع", "سعر"],
            "partnership": ["partnership", "partner", "company", "capital", "profit", "شراكة", "شريك", "شركة", "رأس مال", "ربح"]
        }
        
        # Count keyword occurrences for each type
        scores = {contract_type: 0 for contract_type in keywords}
        
        for contract_type, type_keywords in keywords.items():
            for keyword in type_keywords:
                if keyword in text:
                    scores[contract_type] += 1
        
        # Get the contract type with the highest score
        max_score = 0
        detected_type = None
        
        for contract_type, score in scores.items():
            if score > max_score:
                max_score = score
                detected_type = contract_type
        
        # If no clear type is detected, default to the first type
        if not detected_type or max_score == 0:
            logger.warning("Could not detect contract type, defaulting to employment")
            return "employment"
        
        logger.info(f"Detected contract type: {detected_type}")
        return detected_type
