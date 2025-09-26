import { connection } from "./db.js";

// Escape för LIKE (% och _)
function escapeLike(s) {
  return s.replace(/[%_]/g, (m) => "\\" + m);
}

export async function findAll({ q } = {}) {
  const query = typeof q === "string" ? q.trim() : "";
  if (query) {
    const term = "%" + escapeLike(query) + "%";
    const [rows] = await connection.execute(
      `SELECT id,
              fornamn   AS firstName,
              efternamn AS lastName,
              personnummer AS personalNumber
       FROM Student
       WHERE fornamn LIKE ? ESCAPE '\\'
          OR efternamn LIKE ? ESCAPE '\\'
          OR personnummer LIKE ? ESCAPE '\\'
       ORDER BY efternamn ASC, fornamn ASC`,
      [term, term, term]
    );
    return rows;
  }

  const [rows] = await connection.execute(
    `SELECT id,
            fornamn   AS firstName,
            efternamn AS lastName,
            personnummer AS personalNumber
     FROM Student
     ORDER BY efternamn ASC, fornamn ASC`
  );
  return rows;
}

export async function findById(id) {
  const numId = Number(id);
  if (!Number.isFinite(numId)) return null;
  const [rows] = await connection.execute(
    `SELECT id,
            fornamn   AS firstName,
            efternamn AS lastName,
            personnummer AS personalNumber
     FROM Student
     WHERE id = ?`,
    [numId]
  );
  return rows[0] || null;
}

export async function create({ firstName, lastName, personalNumber }) {
  const [result] = await connection.execute(
    `INSERT INTO Student (fornamn, efternamn, personnummer)
     VALUES (?, ?, ?)`,
    [firstName, lastName, personalNumber]
  );
  return { id: result.insertId, firstName, lastName, personalNumber };
}
