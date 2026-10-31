import { Router, Request, Response } from "express";
import { pool } from "../db.js";
import { PaginationQuery } from "../types.js";

const router = Router();


router.get("/", async (req: Request<{}, {}, {}, PaginationQuery>, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, parseInt(req.query.limit || "6"));
    const offset = (page - 1) * limit;

    const { category, search, sort } = req.query;

    let baseQuery = "FROM cars WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category && category !== "All") {
      baseQuery += ` AND LOWER(category) = LOWER($${paramIndex})`;
      queryParams.push(category);
      paramIndex++;
    }

    if (search) {
      baseQuery += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(brand) LIKE $${paramIndex})`;
      queryParams.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

   
    const countResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

   
    let sortClause = "ORDER BY id ASC";
    if (sort === "price_asc") sortClause = "ORDER BY price ASC";
    if (sort === "price_desc") sortClause = "ORDER BY price DESC";
    if (sort === "hp_desc") sortClause = "ORDER BY hp DESC";

    const fetchQuery = `SELECT * ${baseQuery} ${sortClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(fetchQuery, queryParams);

    return res.json({
      page,
      limit,
      totalItems,
      totalPages,
      data: result.rows,
    });
  } catch (error) {
    console.error("Cars Fetch Error:", error);
    return res.status(500).json({ message: "Машиналарды жүктеу мүмкін болмады" });
  }
});


router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Автомобиль табылмады" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Серверлік қателік" });
  }
});

export default router;