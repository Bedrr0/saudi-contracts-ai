import os
import PyPDF2
import docx
import nltk
from langdetect import detect
from typing import Dict, List, Any, Optional, Tuple
import re

# تنزيل موارد NLTK اللازمة
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

class ContractAnalyzer:
    """فئة لتحليل العقود وفقاً للأنظمة واللوائح السعودية"""
    
    def __init__(self, upload_dir: str = "uploads"):
        """
        تهيئة محلل العقود
        
        Args:
            upload_dir: مجلد تخزين الملفات المرفوعة
        """
        self.upload_dir = upload_dir
        
        # قواميس الكلمات المفتاحية حسب نوع العقد
        self.employment_keywords = {
            'ar': [
                'عقد عمل', 'الموظف', 'صاحب العمل', 'الراتب', 'الأجر', 'مدة العقد', 
                'فترة التجربة', 'ساعات العمل', 'الإجازة السنوية', 'التأمين الطبي',
                'مكافأة نهاية الخدمة', 'إنهاء العقد', 'الإشعار المسبق'
            ],
            'en': [
                'employment contract', 'employee', 'employer', 'salary', 'wage', 'contract duration',
                'probation period', 'working hours', 'annual leave', 'medical insurance',
                'end of service benefits', 'termination', 'notice period'
            ]
        }
        
        self.rental_keywords = {
            'ar': [
                'عقد إيجار', 'المؤجر', 'المستأجر', 'العين المؤجرة', 'مدة الإيجار', 
                'قيمة الإيجار', 'طريقة السداد', 'التزامات المؤجر', 'التزامات المستأجر',
                'الصيانة', 'التأمين', 'إنهاء العقد', 'تجديد العقد'
            ],
            'en': [
                'lease agreement', 'rental contract', 'landlord', 'tenant', 'leased property',
                'rental period', 'rent value', 'payment method', 'landlord obligations',
                'tenant obligations', 'maintenance', 'insurance', 'termination', 'renewal'
            ]
        }
        
        self.sales_keywords = {
            'ar': [
                'عقد بيع', 'البائع', 'المشتري', 'المبيع', 'ثمن البيع', 'طريقة السداد',
                'التسليم', 'الضمان', 'حالة المبيع', 'الفحص', 'إلغاء العقد',
                'ضريبة القيمة المضافة', 'الشروط والأحكام'
            ],
            'en': [
                'sales contract', 'purchase agreement', 'seller', 'buyer', 'item for sale',
                'sale price', 'payment method', 'delivery', 'warranty', 'condition of goods',
                'inspection', 'cancellation', 'vat', 'terms and conditions'
            ]
        }
        
        self.partnership_keywords = {
            'ar': [
                'عقد شراكة', 'الشركاء', 'رأس المال', 'الحصص', 'توزيع الأرباح',
                'الخسائر', 'مدة الشراكة', 'إدارة الشركة', 'صلاحيات الشركاء',
                'انسحاب شريك', 'تصفية الشركة', 'حل النزاعات'
            ],
            'en': [
                'partnership agreement', 'partners', 'capital', 'shares', 'profit distribution',
                'losses', 'partnership duration', 'company management', 'partner authorities',
                'partner withdrawal', 'company liquidation', 'dispute resolution'
            ]
        }
        
        # قواميس المتطلبات القانونية حسب نوع العقد
        self.employment_requirements = {
            'essential': [
                {'name': 'تحديد هوية الطرفين', 'keywords': ['صاحب العمل', 'الموظف', 'الطرف الأول', 'الطرف الثاني']},
                {'name': 'تحديد الراتب والبدلات', 'keywords': ['راتب', 'أجر', 'بدل', 'مكافأة']},
                {'name': 'تحديد مدة العقد', 'keywords': ['مدة العقد', 'عقد محدد المدة', 'عقد غير محدد المدة']},
                {'name': 'تحديد طبيعة العمل', 'keywords': ['المسمى الوظيفي', 'الوصف الوظيفي', 'المهام', 'المسؤوليات']},
                {'name': 'تحديد مكان العمل', 'keywords': ['مقر العمل', 'موقع العمل', 'مكان العمل']},
                {'name': 'تحديد ساعات العمل', 'keywords': ['ساعات العمل', 'الدوام', 'وقت العمل']},
                {'name': 'تحديد فترة التجربة', 'keywords': ['فترة التجربة', 'فترة الاختبار']},
                {'name': 'تحديد الإجازات', 'keywords': ['إجازة سنوية', 'إجازة مرضية', 'إجازة']}
            ],
            'recommended': [
                {'name': 'بند السرية وعدم المنافسة', 'keywords': ['سرية', 'عدم المنافسة', 'عدم الإفشاء']},
                {'name': 'بند التدريب والتطوير', 'keywords': ['تدريب', 'تطوير', 'تأهيل']},
                {'name': 'بند التأمين الطبي', 'keywords': ['تأمين طبي', 'تأمين صحي', 'رعاية صحية']},
                {'name': 'بند مكافأة نهاية الخدمة', 'keywords': ['مكافأة نهاية الخدمة', 'تعويض نهاية الخدمة']}
            ]
        }
        
        self.rental_requirements = {
            'essential': [
                {'name': 'تحديد هوية الطرفين', 'keywords': ['المؤجر', 'المستأجر', 'الطرف الأول', 'الطرف الثاني']},
                {'name': 'وصف العين المؤجرة', 'keywords': ['العين المؤجرة', 'العقار', 'المأجور', 'وصف العقار']},
                {'name': 'تحديد مدة الإيجار', 'keywords': ['مدة الإيجار', 'تاريخ بداية العقد', 'تاريخ نهاية العقد']},
                {'name': 'تحديد قيمة الإيجار', 'keywords': ['قيمة الإيجار', 'الأجرة', 'بدل الإيجار']},
                {'name': 'تحديد طريقة السداد', 'keywords': ['طريقة السداد', 'دفعات', 'أقساط']},
                {'name': 'تحديد التزامات المؤجر', 'keywords': ['التزامات المؤجر', 'واجبات المؤجر']},
                {'name': 'تحديد التزامات المستأجر', 'keywords': ['التزامات المستأجر', 'واجبات المستأجر']}
            ],
            'recommended': [
                {'name': 'بند الصيانة', 'keywords': ['صيانة', 'إصلاح', 'ترميم']},
                {'name': 'بند التأمين', 'keywords': ['تأمين', 'ضمان']},
                {'name': 'بند إنهاء العقد', 'keywords': ['إنهاء العقد', 'فسخ العقد', 'إلغاء العقد']},
                {'name': 'بند تجديد العقد', 'keywords': ['تجديد العقد', 'تمديد العقد']},
                {'name': 'بند حل النزاعات', 'keywords': ['حل النزاعات', 'فض المنازعات', 'تسوية الخلافات']}
            ]
        }
        
        self.sales_requirements = {
            'essential': [
                {'name': 'تحديد هوية الطرفين', 'keywords': ['البائع', 'المشتري', 'الطرف الأول', 'الطرف الثاني']},
                {'name': 'وصف المبيع', 'keywords': ['المبيع', 'السلعة', 'المنتج', 'البضاعة', 'وصف المبيع']},
                {'name': 'تحديد ثمن البيع', 'keywords': ['ثمن البيع', 'السعر', 'القيمة']},
                {'name': 'تحديد طريقة السداد', 'keywords': ['طريقة السداد', 'دفعات', 'أقساط']},
                {'name': 'تحديد التسليم', 'keywords': ['التسليم', 'الاستلام', 'تاريخ التسليم', 'مكان التسليم']},
                {'name': 'تحديد ضريبة القيمة المضافة', 'keywords': ['ضريبة القيمة المضافة', 'ضريبة', 'VAT']}
            ],
            'recommended': [
                {'name': 'بند الضمان', 'keywords': ['ضمان', 'كفالة']},
                {'name': 'بند حالة المبيع', 'keywords': ['حالة المبيع', 'جودة المبيع']},
                {'name': 'بند الفحص', 'keywords': ['فحص', 'معاينة', 'اختبار']},
                {'name': 'بند إلغاء العقد', 'keywords': ['إلغاء العقد', 'فسخ العقد', 'إنهاء العقد']},
                {'name': 'بند استرجاع المنتجات', 'keywords': ['استرجاع', 'إرجاع', 'استبدال']},
                {'name': 'بند حل النزاعات', 'keywords': ['حل النزاعات', 'فض المنازعات', 'تسوية الخلافات']}
            ]
        }
        
        self.partnership_requirements = {
            'essential': [
                {'name': 'تحديد هوية الشركاء', 'keywords': ['الشركاء', 'الطرف الأول', 'الطرف الثاني']},
                {'name': 'تحديد اسم الشركة ونوعها', 'keywords': ['اسم الشركة', 'نوع الشركة', 'الكيان القانوني']},
                {'name': 'تحديد رأس المال', 'keywords': ['رأس المال', 'رأسمال الشركة']},
                {'name': 'تحديد الحصص', 'keywords': ['الحصص', 'توزيع الحصص', 'نسب الملكية']},
                {'name': 'تحديد نشاط الشركة', 'keywords': ['نشاط الشركة', 'غرض الشركة', 'أغراض الشركة']},
                {'name': 'تحديد مدة الشركة', 'keywords': ['مدة الشركة', 'أجل الشركة']},
                {'name': 'تحديد توزيع الأرباح والخسائر', 'keywords': ['توزيع الأرباح', 'توزيع الخسائر', 'الأرباح والخسائر']}
            ],
            'recommended': [
                {'name': 'بند إدارة الشركة', 'keywords': ['إدارة الشركة', 'مجلس الإدارة', 'المدير العام']},
                {'name': 'بند صلاحيات الشركاء', 'keywords': ['صلاحيات الشركاء', 'سلطات الشركاء']},
                {'name': 'بند انسحاب شريك', 'keywords': ['انسحاب شريك', 'خروج شريك', 'تنازل عن الحصص']},
                {'name': 'بند وفاة أحد الشركاء', 'keywords': ['وفاة شريك', 'وفاة أحد الشركاء']},
                {'name': 'بند تصفية الشركة', 'keywords': ['تصفية الشركة', 'حل الشركة', 'انقضاء الشركة']},
                {'name': 'بند حل النزاعات', 'keywords': ['حل النزاعات', 'فض المنازعات', 'تسوية الخلافات']}
            ]
        }
        
        # قواميس المخالفات القانونية حسب نوع العقد
        self.employment_violations = [
            {
                'pattern': r'فترة\s+تجربة.{0,50}(9|تسع|عشر|10|11|12|ثمان|سبع|ست)\s+(شهر|أشهر|اسبوع|اسابيع)',
                'description': 'فترة التجربة تتجاوز الحد الأقصى المسموح به (90 يوماً)',
                'recommendation': 'تعديل فترة التجربة لتكون 90 يوماً كحد أقصى وفقاً لنظام العمل',
                'reference': 'المادة 53 من نظام العمل السعودي',
                'severity': 'high'
            },
            {
                'pattern': r'(إشعار|إخطار|إنذار).{0,30}(أقل من|15|خمسة عشر|عشرين|20|25|ثلاثين|30)\s+(يوم|أيام)',
                'description': 'مدة الإشعار المسبق لإنهاء العقد أقل من المدة المنصوص عليها في نظام العمل',
                'recommendation': 'زيادة مدة الإشعار المسبق إلى 60 يوماً على الأقل للعقود غير محددة المدة',
                'reference': 'المادة 75 من نظام العمل السعودي',
                'severity': 'high'
            },
            {
                'pattern': r'ساعات\s+العمل.{0,50}(9|تسع|عشر|10|11|12|ثمان)\s+ساع',
                'description': 'ساعات العمل تتجاوز الحد الأقصى المسموح به (8 ساعات يومياً)',
                'recommendation': 'تعديل ساعات العمل لتكون 8 ساعات يومياً أو 48 ساعة أسبوعياً كحد أقصى',
                'reference': 'المادة 98 من نظام العمل السعودي',
                'severity': 'medium'
            }
        ]
        
        self.rental_violations = [
            {
                'pattern': r'(يحق|يجوز).{0,50}(المؤجر).{0,50}(زيادة|رفع).{0,50}(الإيجار|الأجرة).{0,50}(دون|بدون).{0,50}(إشعار|إخطار|إنذار)',
                'description': 'لا يجوز للمؤجر زيادة الأجرة خلال مدة العقد دون اتفاق مسبق',
                'recommendation': 'تعديل البند ليتضمن ضرورة الاتفاق المسبق على أي زيادة في الأجرة',
                'reference': 'نظام إيجار - المادة 4',
                'severity': 'high'
            },
            {
                'pattern': r'(يحق|يجوز).{0,50}(المؤجر).{0,50}(إخلاء|إخراج|طرد).{0,50}(المستأجر).{0,50}(دون|بدون).{0,50}(إشعار|إخطار|إنذار)',
                'description': 'لا يجوز للمؤجر إخلاء المستأجر دون إشعار مسبق وسبب مشروع',
                'recommendation': 'تعديل البند ليتضمن ضرورة الإشعار المسبق وتوفر سبب مشروع للإخلاء',
                'reference': 'نظام إيجار - المادة 7',
                'severity': 'high'
            }
        ]
        
        self.sales_violations = [
            {
                'pattern': r'(لا|عدم).{0,50}(ضمان|مسؤولية|مسئولية).{0,50}(البائع).{0,50}(عيوب|أضرار)',
                'description': 'لا يجوز إعفاء البائع من المسؤولية عن العيوب الخفية',
                'recommendation': 'تعديل البند ليتضمن مسؤولية البائع عن العيوب الخفية وفقاً للقانون',
                'reference': 'نظام التجارة الإلكترونية - المادة 12',
                'severity': 'high'
            },
            {
                'pattern': r'(لا|عدم).{0,50}(يحق|يجوز).{0,50}(المشتري).{0,50}(إلغاء|فسخ|إنهاء).{0,50}(العقد|الشراء)',
                'description': 'لا يجوز حرمان المشتري من حقه في إلغاء الشراء خلال المدة القانونية',
                'recommendation': 'تعديل البند ليتضمن حق المشتري في إلغاء الشراء خلال 7 أيام من تاريخ الاستلام',
                'reference': 'نظام التجارة الإلكترونية - المادة 14',
                'severity': 'high'
            }
        ]
        
        self.partnership_violations = [
            {
                'pattern': r'(يتحمل).{0,50}(شريك|طرف).{0,50}(جميع|كل|كامل).{0,50}(الخسائر)',
                'description': 'لا يجوز الاتفاق على إعفاء أحد الشركاء من الخسائر أو تحميل شريك واحد جميع الخسائر',
                'recommendation': 'تعديل البند ليتضمن توزيع الخسائر بين الشركاء بنسبة حصصهم في رأس المال',
                'reference': 'نظام الشركات - المادة 12',
                'severity': 'high'
            },
            {
                'pattern': r'(يحق|يجوز).{0,50}(شريك|طرف).{0,50}(منفرد|وحده).{0,50}(تصفية|حل|إنهاء).{0,50}(الشركة)',
                'description': 'لا يجوز لشريك واحد تصفية الشركة بشكل منفرد دون موافقة باقي الشركاء',
                'recommendation': 'تعديل البند ليتضمن ضرورة موافقة جميع الشركاء أو الأغلبية على تصفية الشركة',
                'reference': 'نظام الشركات - المادة 16',
                'severity': 'high'
            }
        ]
    
    def detect_language(self, text: str) -> str:
        """
        اكتشاف لغة النص
        
        Args:
            text: النص المراد اكتشاف لغته
            
        Returns:
            رمز اللغة ('ar' للعربية، 'en' للإنجليزية)
        """
        try:
            lang = detect(text)
            if lang == 'ar':
                return 'ar'
            else:
                return 'en'
        except:
            # إذا فشل الاكتشاف، نفترض أن اللغة عربية
            return 'ar'
    
    def detect_contract_type(self, text: str, language: str) -> str:
        """
        اكتشاف نوع العقد بناءً على الكلمات المفتاحية
        
        Args:
            text: نص العقد
            language: لغة العقد ('ar' أو 'en')
            
        Returns:
            نوع العقد ('employment', 'rental', 'sales', 'partnership')
        """
        # عدد الكلمات المفتاحية المطابقة لكل نوع
        employment_count = 0
        rental_count = 0
        sales_count = 0
        partnership_count = 0
        
        # البحث عن الكلمات المفتاحية
        for keyword in self.employment_keywords[language]:
            if keyword.lower() in text.lower():
                employment_count += 1
        
        for keyword in self.rental_keywords[language]:
            if keyword.lower() in text.lower():
                rental_count += 1
        
        for keyword in self.sales_keywords[language]:
            if keyword.lower() in text.lower():
                sales_count += 1
        
        for keyword in self.partnership_keywords[language]:
            if keyword.lower() in text.lower():
                partnership_count += 1
        
        # تحديد النوع بناءً على أكبر عدد من الكلمات المفتاحية
        counts = {
            'employment': employment_count,
            'rental': rental_count,
            'sales': sales_count,
            'partnership': partnership_count
        }
        
        return max(counts, key=counts.get)
    
    def extract_text_from_file(self, file_id: str) -> Tuple[str, str]:
        """
        استخراج النص من الملف
        
        Args:
            file_id: معرف الملف
            
        Returns:
            tuple: (نص الملف، امتداد الملف)
        """
        # البحث عن الملف بجميع الامتدادات المدعومة
        for ext in ['.pdf', '.docx', '.txt']:
            file_path = os.path.join(self.upload_dir, f"{file_id}{ext}")
            if os.path.exists(file_path):
                # استخراج النص حسب نوع الملف
                if ext == '.pdf':
                    return self._extract_text_from_pdf(file_path), ext
                elif ext == '.docx':
                    return self._extract_text_from_docx(file_path), ext
                elif ext == '.txt':
                    return self._extract_text_from_txt(file_path), ext
        
        # إذا لم يتم العثور على الملف
        raise FileNotFoundError(f"لم يتم العثور على الملف بالمعرف: {file_id}")
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """استخراج النص من ملف PDF"""
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """استخراج النص من ملف DOCX"""
        doc = docx.Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    
    def _extract_text_from_txt(self, file_path: str) -> str:
        """استخراج النص من ملف TXT"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    def check_missing_clauses(self, text: str, contract_type: str) -> List[Dict[str, Any]]:
        """
        التحقق من البنود المفقودة في العقد
        
        Args:
            text: نص العقد
            contract_type: نوع العقد
            
        Returns:
            قائمة بالبنود المفقودة
        """
        missing_clauses = []
        
        # تحديد المتطلبات حسب نوع العقد
        if contract_type == 'employment':
            requirements = self.employment_requirements
        elif contract_type == 'rental':
            requirements = self.rental_requirements
        elif contract_type == 'sales':
            requirements = self.sales_requirements
        elif contract_type == 'partnership':
            requirements = self.partnership_requirements
        else:
            return missing_clauses
        
        # التحقق من البنود الأساسية
        for req in requirements['essential']:
            found = False
            for keyword in req['keywords']:
                if keyword.lower() in text.lower():
                    found = True
                    break
            
            if not found:
                missing_clauses.append({
                    'importance': 'high',
                    'description': req['name'],
                    'recommendation': f"إضافة بند {req['name']} إلى العقد"
                })
        
        # التحقق من البنود الموصى بها
        for req in requirements['recommended']:
            found = False
            for keyword in req['keywords']:
                if keyword.lower() in text.lower():
                    found = True
                    break
            
            if not found:
                missing_clauses.append({
                    'importance': 'medium',
                    'description': req['name'],
                    'recommendation': f"إضافة بند {req['name']} إلى العقد"
                })
        
        return missing_clauses
    
    def check_violations(self, text: str, contract_type: str) -> List[Dict[str, Any]]:
        """
        التحقق من المخالفات القانونية في العقد
        
        Args:
            text: نص العقد
            contract_type: نوع العقد
            
        Returns:
            قائمة بالمخالفات القانونية
        """
        violations = []
        
        # تحديد المخالفات حسب نوع العقد
        if contract_type == 'employment':
            violation_patterns = self.employment_violations
        elif contract_type == 'rental':
            violation_patterns = self.rental_violations
        elif contract_type == 'sales':
            violation_patterns = self.sales_violations
        elif contract_type == 'partnership':
            violation_patterns = self.partnership_violations
        else:
            return violations
        
        # البحث عن المخالفات
        for violation in violation_patterns:
            if re.search(violation['pattern'], text, re.IGNORECASE):
                violations.append({
                    'severity': violation['severity'],
                    'description': violation['description'],
                    'recommendation': violation['recommendation'],
                    'reference': violation['reference']
                })
        
        return violations
    
    def check_compliant_clauses(self, text: str, contract_type: str) -> List[Dict[str, Any]]:
        """
        التحقق من البنود المتوافقة في العقد
        
        Args:
            text: نص العقد
            contract_type: نوع العقد
            
        Returns:
            قائمة بالبنود المتوافقة
        """
        compliant_clauses = []
        
        # تحديد المتطلبات حسب نوع العقد
        if contract_type == 'employment':
            requirements = self.employment_requirements
            reference_prefix = "المادة {} من نظام العمل السعودي"
            references = {
                'تحديد هوية الطرفين': '37',
                'تحديد الراتب والبدلات': '61',
                'تحديد مدة العقد': '55',
                'تحديد طبيعة العمل': '51',
                'تحديد مكان العمل': '58',
                'تحديد ساعات العمل': '98',
                'تحديد فترة التجربة': '53',
                'تحديد الإجازات': '109'
            }
        elif contract_type == 'rental':
            requirements = self.rental_requirements
            reference_prefix = "نظام إيجار - المادة {}"
            references = {
                'تحديد هوية الطرفين': '2',
                'وصف العين المؤجرة': '3',
                'تحديد مدة الإيجار': '3',
                'تحديد قيمة الإيجار': '4',
                'تحديد طريقة السداد': '4',
                'تحديد التزامات المؤجر': '5',
                'تحديد التزامات المستأجر': '6'
            }
        elif contract_type == 'sales':
            requirements = self.sales_requirements
            reference_prefix = "نظام التجارة الإلكترونية - المادة {}"
            references = {
                'تحديد هوية الطرفين': '6',
                'وصف المبيع': '8',
                'تحديد ثمن البيع': '9',
                'تحديد طريقة السداد': '9',
                'تحديد التسليم': '10',
                'تحديد ضريبة القيمة المضافة': '9'
            }
        elif contract_type == 'partnership':
            requirements = self.partnership_requirements
            reference_prefix = "نظام الشركات - المادة {}"
            references = {
                'تحديد هوية الشركاء': '6',
                'تحديد اسم الشركة ونوعها': '7',
                'تحديد رأس المال': '8',
                'تحديد الحصص': '8',
                'تحديد نشاط الشركة': '7',
                'تحديد مدة الشركة': '7',
                'تحديد توزيع الأرباح والخسائر': '12'
            }
        else:
            return compliant_clauses
        
        # التحقق من البنود الأساسية
        for req in requirements['essential']:
            for keyword in req['keywords']:
                if keyword.lower() in text.lower():
                    reference = reference_prefix.format(references.get(req['name'], ''))
                    compliant_clauses.append({
                        'description': req['name'],
                        'reference': reference
                    })
                    break
        
        return compliant_clauses
    
    def calculate_compliance_score(self, missing_clauses: List[Dict[str, Any]], violations: List[Dict[str, Any]], contract_type: str) -> int:
        """
        حساب درجة الامتثال للعقد
        
        Args:
            missing_clauses: قائمة البنود المفقودة
            violations: قائمة المخالفات
            contract_type: نوع العقد
            
        Returns:
            درجة الامتثال (0-100)
        """
        # تحديد عدد البنود الأساسية حسب نوع العقد
        if contract_type == 'employment':
            essential_count = len(self.employment_requirements['essential'])
        elif contract_type == 'rental':
            essential_count = len(self.rental_requirements['essential'])
        elif contract_type == 'sales':
            essential_count = len(self.sales_requirements['essential'])
        elif contract_type == 'partnership':
            essential_count = len(self.partnership_requirements['essential'])
        else:
            essential_count = 0
        
        # حساب عدد البنود الأساسية المفقودة
        missing_essential_count = sum(1 for clause in missing_clauses if clause['importance'] == 'high')
        
        # حساب عدد المخالفات الخطيرة
        high_violations_count = sum(1 for violation in violations if violation['severity'] == 'high')
        
        # حساب عدد المخالفات المتوسطة
        medium_violations_count = sum(1 for violation in violations if violation['severity'] == 'medium')
        
        # حساب درجة الامتثال
        if essential_count == 0:
            return 50  # قيمة افتراضية إذا لم يتم تحديد نوع العقد
        
        # خصم 10 نقاط لكل بند أساسي مفقود
        essential_penalty = min(50, missing_essential_count * 10)
        
        # خصم 15 نقاط لكل مخالفة خطيرة
        high_violations_penalty = min(30, high_violations_count * 15)
        
        # خصم 5 نقاط لكل مخالفة متوسطة
        medium_violations_penalty = min(20, medium_violations_count * 5)
        
        # حساب الدرجة النهائية
        score = 100 - essential_penalty - high_violations_penalty - medium_violations_penalty
        
        # التأكد من أن الدرجة بين 0 و 100
        return max(0, min(100, score))
    
    def get_compliance_level(self, score: int) -> str:
        """
        تحديد مستوى الامتثال بناءً على الدرجة
        
        Args:
            score: درجة الامتثال
            
        Returns:
            مستوى الامتثال
        """
        if score >= 90:
            return "ممتاز"
        elif score >= 80:
            return "جيد جداً"
        elif score >= 70:
            return "جيد"
        elif score >= 60:
            return "متوسط"
        else:
            return "ضعيف"
    
    def analyze_contract(self, file_id: str, contract_type: Optional[str] = None) -> Dict[str, Any]:
        """
        تحليل العقد
        
        Args:
            file_id: معرف الملف
            contract_type: نوع العقد (اختياري)
            
        Returns:
            نتائج التحليل
        """
        try:
            # استخراج النص من الملف
            text, file_ext = self.extract_text_from_file(file_id)
            
            # اكتشاف لغة العقد
            language = self.detect_language(text)
            
            # اكتشاف نوع العقد إذا لم يتم تحديده
            if not contract_type:
                contract_type = self.detect_contract_type(text, language)
            
            # التحقق من البنود المفقودة
            missing_clauses = self.check_missing_clauses(text, contract_type)
            
            # التحقق من المخالفات
            violations = self.check_violations(text, contract_type)
            
            # التحقق من البنود المتوافقة
            compliant_clauses = self.check_compliant_clauses(text, contract_type)
            
            # حساب درجة الامتثال
            compliance_score = self.calculate_compliance_score(missing_clauses, violations, contract_type)
            
            # تحديد مستوى الامتثال
            compliance_level = self.get_compliance_level(compliance_score)
            
            # إنشاء نتائج التحليل
            analysis_result = {
                "file_id": file_id,
                "contract_type": contract_type,
                "language": language,
                "file_type": file_ext[1:],  # إزالة النقطة من الامتداد
                "compliance_score": compliance_score,
                "compliance_level": compliance_level,
                "analysis_date": "2025-04-28T04:00:00Z",  # يمكن استخدام التاريخ الفعلي
                "issues": violations,
                "missing_clauses": missing_clauses,
                "compliant_clauses": compliant_clauses
            }
            
            return analysis_result
        
        except Exception as e:
            # إرجاع خطأ في حالة فشل التحليل
            return {
                "file_id": file_id,
                "error": str(e),
                "status": "failed",
                "message": "فشل في تحليل العقد"
            }
