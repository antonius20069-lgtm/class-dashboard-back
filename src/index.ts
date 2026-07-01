import express from 'express';
import subjectsRouter from './routes/subjects.js'
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// برمجيات وسيطة لقراءة البيانات (Middleware)
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: true
}));

app.use('/api/subjects',subjectsRouter)


app.get("/", (req, res) =>
    res.send('مرحباً بك في خادم Express المعتمد على TypeScript!')
)

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل الآن على الرابط: http://localhost:${PORT}`);
});