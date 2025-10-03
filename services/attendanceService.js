//Mellanlager för närvaro (kopplar routes till databasen)
import * as data from "../data/attendanceData.js";

//Sätt eller uppdatera närvaro
export const mark = (p) => data.upsertMark(p);

//Hämta närvaro för en student
export const byStudent = (id) => data.listByStudent(id);

//Hämta närvaro för en kurs
export const byCourse = (id) => data.listByCourse(id);

//Hämta metadata (antal studenter,kurser, registreringar, närvarorader)
export const counts = () => data.countsMeta();

//Hämta närvaroprocent för en kurs
export const rateForCourse = (id) => data.courseAttendanceRate(id);
