import { connection } from "./db.js";

//Upsert av närvaro:
//-Försök först uppdatera en existerande rad (unik per registrering_id + datum)
//-Om ingen rad uppdateras (affectedRows === 0)-->skapa ny rad
//Säker: använder prepared statements (frågetecken + values-array)--> skydd mot SQL-injektion.
export async function upsertMark({
  registrationId,
  date,
  status,
  comment = null,
}) {
  const regId = Number(registrationId);

  //Update om posten redan finns för samma registrering + datum
  const [upd] = await connection.execute(
    `UPDATE Narvaro
    SET status = ?, kommentar = ?, datum = ?
    WHERE registrering_id = ? AND datum = ?`,
    [status, comment, date, regId, date]
  );

  //Om ingen rad uppdateras --> INSERT (skapa ny post)
  if (upd.affectedRows === 0) {
    await connection.execute(
      `INSERT INTO Narvaro (datum, status, kommentar, registrering_id)
      VALUES (?, ?, ?, ?)`,
      [date, status, comment, regId]
    );
  }

  //Returvärde i ett konsekvent objekt-format som API:et kan svara med
  return { registrationId: regId, date, status, comment };
}

//Lista närvaro för en given student, hämtar även kursinfo via JOINs för att göra svaret användbart i frontend/test.
export async function listByStudent(studentId) {
  const id = Number(studentId);
  const [rows] = await connection.execute(
    `SELECT n.id  AS attendanceId,
      n.datum  AS date,
      n.status  AS status,
      n.kommentar  AS comment,
      r.id  AS registrationId,
      k.id  AS courseId,
      k.kursnamn  AS courseName,
      k.startdatum  AS courseStart,
      k.slutdatum  AS courseEnd
      FROM Narvaro n
      JOIN Registrering r ON r.id = n.registrering_id
      JOIN Kurs k ON k.id = r.kurs_id
      WHERE r.student_id = ?
      ORDER BY n.datum DESC`,
    [id]
  );
  return rows;
}

//Lista närvaro för given kurs, hämtar även studentens namn via JOIN så att listan är läsbar.
export async function listByCourse(courseId) {
  const id = Number(courseId);
  const [rows] = await connection.execute(
    `SELECT n id  AS attendanceId,
      n.datum  AS date,
      n.status  AS status,
      n.kommentar  AS comment,
      r.id  AS registrationId,
      s.id  AS stdentId,
      s.fornamn  AS firstName,
      s.efternamn AS lastName
      FROM Narvaro n
      JOIN Registrering r ON r.id = n.registrering_id
      JOIN Student s ON s.id = r.student_id
      WHERE r.kurs_id = ?
      ORDER BY n.datum DESC, s.efternamn ASC`,
    [id]
  );
  return rows;
}

//Meta: totalsiffror för att uppfylla "meta-data"kraven. Returnerar antal studenter, kurser, registreringar och närvarorader.
export async function countsMeta() {
  const [[{ students }]] = await connection.query(
    "SELECT COUNT(*) AS students FROM Student"
  );
  const [[{ courses }]] = await connection.query(
    "SELECT COUNT(*) AS courses FROM Kurs"
  );
  const [[{ registrations }]] = await connection.query(
    "SELECT COUNT(*) AS registrations FROM Registrering"
  );
  const [[{ attendance }]] = await connection.query(
    "SELECT COUNT(*) AS attendance FROM Narvaro"
  );
  return { students, courses, registrations, attendance };
}

//Meta närvaroprocent för en kurs. Total: antat närvarorader för en kursen oavsett status
//Present: antal rader där status = 'narvaro'.
//Rate: presnet total (0 om total = 0)
export async function courseAttendanceRate(courceId) {
  const id = Number(courceId);

  const [[{ total }]] = await connection.query(
    `SELECT COUNT(*) AS total
      FROM Narvaro n
      JOIN Registrering r ON r.id = n.registrering_id
      WHERE r.kurs_id = ?`,
    [id]
  );

  const [[{ present }]] = await connection.query(
    `SELECT COUNT(*) AS present
      FROM Narvaro n 
      JOIN Registrering r ON r.id = n.registrering_id
      WHERE r.kurs_id = ? AND n.status = 'narvaro'`,
    [id]
  );
  return { courceId: id, present, total, rate: total ? present / total : 0 };
}
