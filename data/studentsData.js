import { connection } from "./db.js";

//Hämta alla studenter (med eller utan sökord)
export async function findAll({ q } = {}) {
  const query = (q ?? "").trim();

  if (query) {
    const term = `%${query}%`;
    const [rows] = await connection.execute(
      `SELECT
         id,
         fornamn    AS firstName,
         efternamn  AS lastName,
         personnummer AS personalNumber
       FROM Student
       WHERE fornamn LIKE ?
          OR efternamn LIKE ?
          OR personnummer LIKE ?
       ORDER BY efternamn ASC, fornamn ASC`,
      [term, term, term]
    );
    return rows;
  }

  const [rows] = await connection.execute(
    `SELECT
       id,
       fornamn    AS firstName,
       efternamn  AS lastName,
       personnummer AS personalNumber
     FROM Student
     ORDER BY efternamn ASC, fornamn ASC`
  );
  return rows;
}

//Hämta en student med id
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

//Skapa en ny student
export async function create({ firstName, lastName, personalNumber }) {
  const [result] = await connection.execute(
    `INSERT INTO Student (fornamn, efternamn, personnummer)
     VALUES (?, ?, ?)`,
    [firstName, lastName, personalNumber]
  );
  return { id: result.insertId, firstName, lastName, personalNumber };
}
