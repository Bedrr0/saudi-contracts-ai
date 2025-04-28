#!/bin/bash

# سكريبت لتشغيل الجزء الخلفي (Backend) للمشروع

# تفعيل البيئة الافتراضية
source venv/bin/activate

# تشغيل الخادم
echo "بدء تشغيل خادم Saudi AI Contracts API..."
echo "الخادم يعمل على العنوان: http://localhost:8000"
echo "اضغط Ctrl+C لإيقاف الخادم"

# تشغيل الخادم مع السماح بالوصول من أي عنوان IP
python api.py
