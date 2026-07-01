import express from "express";
import {and, desc, eq, getTableColumns, ilike, or, sql} from "drizzle-orm";
import {departments, subjects} from "../db/schema/app.js";
import {db} from "../db/db.js";

const  router = express.Router();

router.get('/', async (req, res) => {
    try {
const {search, department ,page=1 ,limit = 10 } = req.query;

        const currentPage =  Math.max(1,parseInt(String(page),10) ||1);
        const LimitPerPage = Math.min(Math.max(1,parseInt(String(limit),10) ||1),100)
        const offset = (currentPage - 1) * +limit;

const filterCoditions = []

    if(search) {
        filterCoditions.push(
            or(
                ilike(subjects.name, `%${search}%`),
            ilike(subjects.code, `%${search}%`)
        )
        )

    }

        if(department) {
            filterCoditions.push(
                or(
                    ilike(departments.name, `%${search}%`),

                )
            )

        }
        const whereClause = filterCoditions.length > 0 ? and(... filterCoditions) : undefined;

        const countResults = await db
            .select({count : sql<number>`count(*)`}).from(subjects)
            .leftJoin(departments,eq(subjects.departmentID,departments.id))
            .where(whereClause)

        const  totalCount = countResults[0]?.count??0
        const subjectsList = await db.select({... getTableColumns(subjects),
         department :{... getTableColumns(departments)},}).from(subjects).leftJoin(departments,eq(subjects.departmentID,departments.id))
            .orderBy(desc(subjects.createdAt)).limit(LimitPerPage).offset(offset)

        res.status(200).json({
data:subjectsList,
pagination:{
    page:currentPage,
    limit:LimitPerPage,
    total : totalCount,
    totalPages:Math.ceil(totalCount/LimitPerPage),
}
        })


    }catch (error) {
        console.error('GIT/subjects', error);
      res.status(500).json({error: 'Server Error'});
}
})
export default router;