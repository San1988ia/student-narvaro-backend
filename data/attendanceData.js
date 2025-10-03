import { connection } from "./db.js";

//Spara eller uppdatera närvaro
//- Kollar först om raden redan finns (samma registrering + datum)
//- om den finns -> uppdatera
//- om den inte finns -> skapa ny
export async function upsertMark({
  registrationId,
  date,
  status,
  comment = null,
}) {
  const regId = Number(registrationId);

  //Försök uppdatera befintlig rad
  const [upd] = await connection.execute(
    `UPDATE Narvaro
    SET status = ?, kommentar = ?, datum = ?
    WHERE registrering_id = ? AND datum = ?`,
    [status, comment, date, regId, date]
  );

  //Fanns den inte så skapa ny
  if (upd.affectedRows === 0) {
    await connection.execute(
      `INSERT INTO Narvaro (datum, status, kommentar, registrering_id)
      VALUES (?, ?, ?, ?)`,
      [date, status, comment, regId]
    );
  }

  //Svar tillbaka i ett enkelt objekt
  return { registrationId: regId, date, status, comment };
}

//Hämta alla närvarorader för en student
// (inkluderar kursens namn och datum)
export async function listByStudent(studentId) {
  const id = Number(studentId);
  const [rows] = await connection.execute(
    `SELECT n.id  AS attendanceId,
      DATE_FORMAT(n.datum, '%Y-%m-%d') AS date,
      n.status  AS status,
      n.kommentar  AS comment,
      r.id  AS registrationId,
      k.id  AS courseId,
      k.kursnamn  AS courseName,
      DATE_FORMAT(k.startdatum, '%Y-%m-%d') AS courseStart,
      DATE_FORMAT(k.slutdatum, '%Y-%m-%d') AS courseEnd
      FROM Narvaro n
      JOIN Registrering r ON r.id = n.registrering_id
      JOIN Kurs k ON k.id = r.kurs_id
      WHERE r.student_id = ?
      ORDER BY n.datum DESC`,
    [id]
  );
  return rows;
}

//Hämta alla närvarorader för en kurs
// (inkluderar studentens namn)
export async function listByCourse(courseId) {
  const id = Number(courseId);
  const [rows] = await connection.execute(
    `SELECT n.id  AS attendanceId,
      DATE_FORMAT(n.datum, '%Y-%m-%d') AS date,
      n.status  AS status,
      n.kommentar  AS comment,
      r.id  AS registrationId,
      s.id  AS studentId,
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

//----META-funktioner------

//Räkna antal studenter, kurser, registreringar och närvarorader
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

//Närvaroprocent för en kurs.
// Total= alla rader i Narvaro för kursen
//Present= rader där status = 'narvaro'.
//Rate: present total (0 om total = 0)
export async function courseAttendanceRate(courseId) {
  const id = Number(courseId);

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
  return { courseId: id, present, total, rate: total ? present / total : 0 };
}
