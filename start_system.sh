#!/bin/bash

# سكريبت لتشغيل النظام بالكامل

# تشغيل الجزء الخلفي (Backend)
echo "جاري تشغيل الجزء الخلفي (Backend)..."
cd backend
source venv/bin/activate
python api.py &
BACKEND_PID=$!
cd ..

# انتظار بدء تشغيل الجزء الخلفي
echo "انتظار بدء تشغيل الجزء الخلفي..."
sleep 5

# تشغيل الجزء الأمامي (Frontend)
echo "جاري تشغيل الجزء الأمامي (Frontend)..."
cd frontend
npm start &
FRONTEND_PID=$!

echo "النظام يعمل الآن!"
echo "الجزء الخلفي (Backend): http://localhost:8000"
echo "الجزء الأمامي (Frontend): http://localhost:3000"
echo "اضغط Ctrl+C لإيقاف النظام"

# انتظار إيقاف النظام
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
