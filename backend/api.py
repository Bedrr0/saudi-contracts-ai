from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import Optional
import os
import shutil
from enum import Enum
import uvicorn
from contract_analyzer import ContractAnalyzer

# إنشاء مجلدات للملفات المرفوعة والتقارير إذا لم تكن موجودة
UPLOAD_DIR = "uploads"
REPORTS_DIR = "reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

# إنشاء محلل العقود
analyzer = ContractAnalyzer(upload_dir=UPLOAD_DIR)

app = FastAPI(
    title="Saudi AI Contracts API",
    description="واجهة برمجة التطبيقات لتحليل العقود وفقاً للأنظمة واللوائح السعودية",
    version="1.0.0"
)

# إضافة CORS للسماح بالوصول من الواجهة الأمامية
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # في الإنتاج، يجب تحديد المصادر المسموح بها
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تعريف أنواع العقود المدعومة
class ContractType(str, Enum):
    EMPLOYMENT = "employment"
    RENTAL = "rental"
    SALES = "sales"
    PARTNERSHIP = "partnership"

@app.get("/")
async def root():
    """نقطة النهاية الرئيسية للتحقق من حالة الخادم"""
    return {"message": "مرحباً بك في واجهة برمجة تطبيقات Saudi AI Contracts", "status": "online"}

@app.post("/upload-contract/")
async def upload_contract(
    file: UploadFile = File(...),
    contract_type: ContractType = Form(...),
    language: Optional[str] = Form(None)
):
    """
    رفع ملف عقد للتحليل
    
    - **file**: ملف العقد (PDF, DOCX, TXT)
    - **contract_type**: نوع العقد (employment, rental, sales, partnership)
    - **language**: لغة العقد (اختياري، يتم اكتشافها تلقائياً إذا لم يتم تحديدها)
    """
    # التحقق من نوع الملف
    allowed_extensions = [".pdf", ".docx", ".txt"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="نوع الملف غير مدعوم. الأنواع المدعومة هي: PDF, DOCX, TXT"
        )
    
    try:
        # إنشاء معرف فريد للملف باستخدام الاسم الأصلي بدون امتداد
        file_id = os.path.splitext(file.filename)[0].replace(" ", "_")
        
        # إنشاء اسم الملف الجديد
        new_filename = f"{file_id}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        
        # حفظ الملف
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # تحليل العقد مباشرة
        analysis_result = analyzer.analyze_contract(file_id, contract_type.value)
        
        # إرجاع نتائج التحليل
        return {
            "file_id": file_id,
            "original_filename": file.filename,
            "saved_filename": new_filename,
            "contract_type": contract_type,
            "language": language or analysis_result.get("language", "unknown"),
            "status": "completed",
            "analysis_result": analysis_result
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"حدث خطأ أثناء معالجة الملف: {str(e)}"
        )

@app.get("/analysis-result/{file_id}")
async def get_analysis_result(file_id: str, contract_type: Optional[ContractType] = None):
    """
    الحصول على نتائج تحليل العقد
    
    - **file_id**: معرف الملف
    - **contract_type**: نوع العقد (اختياري)
    """
    try:
        # تحليل العقد
        contract_type_value = contract_type.value if contract_type else None
        analysis_result = analyzer.analyze_contract(file_id, contract_type_value)
        
        return analysis_result
    
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"لم يتم العثور على الملف أو حدث خطأ أثناء التحليل: {str(e)}"
        )

@app.get("/supported-contract-types")
async def get_supported_contract_types():
    """الحصول على أنواع العقود المدعومة"""
    return {
        "contract_types": [
            {"id": "employment", "name_ar": "عقد عمل", "name_en": "Employment Contract"},
            {"id": "rental", "name_ar": "عقد إيجار", "name_en": "Rental Contract"},
            {"id": "sales", "name_ar": "عقد بيع", "name_en": "Sales Contract"},
            {"id": "partnership", "name_ar": "عقد شراكة", "name_en": "Partnership Contract"}
        ]
    }

@app.get("/compliance-levels")
async def get_compliance_levels():
    """الحصول على مستويات الامتثال وترجمتها"""
    return {
        "compliance_levels": [
            {"id": "excellent", "score_range": "90-100", "name_ar": "ممتاز", "name_en": "Excellent"},
            {"id": "very_good", "score_range": "80-89", "name_ar": "جيد جداً", "name_en": "Very Good"},
            {"id": "good", "score_range": "70-79", "name_ar": "جيد", "name_en": "Good"},
            {"id": "average", "score_range": "60-69", "name_ar": "متوسط", "name_en": "Average"},
            {"id": "poor", "score_range": "0-59", "name_ar": "ضعيف", "name_en": "Poor"}
        ]
    }

# تضمين الملفات الثابتة للتقارير
app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
