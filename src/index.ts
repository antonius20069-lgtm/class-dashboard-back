import AgentAPI from "apminsight";
AgentAPI.config()
import express from 'express';

import subjectsRouter from './routes/subjects.js'
import classesRouter from './routes/classes.js'
import departmentsRouter from "./routes/departments.js";

import cors from 'cors';
import securityMiddleware from "./middleware/security.js";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;


if (!process.env.FRONTEND_URL) throw new Error('No url provided');
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],

}));

app.all('/api/auth/*splat', toNodeHandler(auth));


app.use(express.json());




app.use(securityMiddleware)




app.use('/api/subjects',subjectsRouter)
app.use("/api/users", usersRouter);
app.use('/api/classes',classesRouter )
app.use("/api/departments", departmentsRouter);


app.get("/", (req, res) =>
    res.send('مرحباً بك في خادم Express المعتمد على TypeScript!')
)

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل الآن على الرابط: http://localhost:${PORT}`);
});