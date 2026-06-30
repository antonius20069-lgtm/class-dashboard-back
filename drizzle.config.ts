import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
}

export default defineConfig({
    schema: "./src/db/schema/schema.ts", // مكان ملف الجداول
    out: "./drizzle",          // الفولدر اللي هيتكتب فيه ملفات الـ SQL
    dialect: "postgresql",     // نوع قاعدة البيانات
    dbCredentials: {
        url: process.env.DATABASE_URL, // قراءة الرابط من ملف .env
    }
});