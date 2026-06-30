import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// برمجيات وسيطة لقراءة البيانات (Middleware)
app.use(express.json());

// المسار الأساسي
app.get('/', (req, res) => {
    res.send('مرحباً بك في خادم Express المعتمد على TypeScript!');
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل الآن على الرابط: http://localhost:${PORT}`);
});