"""
API module for the Saudi AI Contracts system.
"""

import os
import logging
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from src.config import API_SETTINGS
from src.main import SaudiAIContracts

# Configure logging
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize the Saudi AI Contracts system
system = SaudiAIContracts()

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Saudi AI Contracts system is running"})

@app.route('/api/analyze', methods=['POST'])
def analyze_contract():
    """
    Analyze a contract document.
    
    Expects a multipart/form-data request with:
    - file: The contract document file
    - contract_type: (Optional) The type of contract
    """
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check file extension
    allowed_extensions = API_SETTINGS["allowed_file_types"]
    file_extension = os.path.splitext(file.filename)[1].lower()[1:]  # Remove the dot
    
    if file_extension not in allowed_extensions:
        return jsonify({
            "error": f"File type not supported. Allowed types: {', '.join(allowed_extensions)}"
        }), 400
    
    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    # Get contract type if provided
    contract_type = request.form.get('contract_type')
    
    try:
        # Analyze the contract
        results = system.analyze_contract(file_path, contract_type)
        
        # Return the analysis results and report path
        return jsonify({
            "success": True,
            "contract_type": results["contract_type"],
            "compliance_score": results["analysis_results"]["compliance_score"],
            "violations_count": len(results["analysis_results"]["violations"]),
            "missing_clauses_count": len(results["analysis_results"]["missing_clauses"]),
            "risks_count": len(results["analysis_results"]["risks"]),
            "report_url": f"/api/reports/{os.path.basename(results['report_path'])}"
        })
    
    except Exception as e:
        logger.error(f"Error analyzing contract: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/api/reports/<filename>', methods=['GET'])
def get_report(filename):
    """
    Get a generated report.
    
    Args:
        filename: The report filename
    """
    reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
    report_path = os.path.join(reports_dir, filename)
    
    if not os.path.exists(report_path):
        return jsonify({"error": "Report not found"}), 404
    
    return send_file(report_path, as_attachment=True)

@app.route('/api/contract-types', methods=['GET'])
def get_contract_types():
    """Get available contract types."""
    from src.config import CONTRACT_TYPES
    return jsonify(CONTRACT_TYPES)

def start_api_server():
    """Start the API server."""
    app.run(
        host=API_SETTINGS["host"],
        port=API_SETTINGS["port"],
        debug=API_SETTINGS["debug"]
    )

if __name__ == '__main__':
    start_api_server()
