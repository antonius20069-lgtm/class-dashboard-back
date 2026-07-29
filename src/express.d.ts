import * as express from 'express';
declare global {
    namespace Express {
        interface Request {
            user?:{
                roles?: 'admin' | "teacher" | "student";
            }
        }
    }
}
export {}