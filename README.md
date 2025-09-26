# Student-närvaro Backend (Node + Express + MySQL)

## Beskrivning 📖

Ett enkelt JSON-API för att hantera 'studenters närvaro'. Byggt med 'Node.js (ESM)', 'Express' och 'mysql2/promise'.
API:et levererar endast 'JSON' och är strukturerat med 'routes --> services --> data' (separation of concerns).

## Tech-stack 🧰

- Node.js (ES Modules)
- Express
- MySQL (mysql2/promise)
- Ingen ORM (SQL med prepared statements används för säkerhet)

## Mappstruktur 📁

.
├─ server.js # Startpunkt (Express-app + routers)
├─ routes/ # API-routes (endpoints)
├─ services/ # Mellanlager (business logic)
├─ data/ # DB-anslutning + SQL-funktioner
│ ├─ db.js
│ ├─ studentsData.js
│ └─ attendanceData.js
└─ package.json

- **routes/** -> tar emot requests och skickar svar (endpoints).
- **services/** -> logik och koppling mellan routes och databasen.
- **data/** -> SQL- frågor och databasanslutning.

## Installation och körning 🔧

Klona projektet:

```powershell
git clone https://github.com/San1988ia/student-narvaro-backend.git
cd student-narvaro-backend

*Installera beroenden:
npm install

*Sätt miljövariabler(exempel för Windows PowerShell):
setx DB_HOST "localhost"
setx DB_PORT "3306"
setx DB_USER "root"
setx DB_PASSWORD "DITT_LÖSENORD_HÄR"
setx DB_NAME "studentnarvaro"

*Starta servern:
npm start
Nu körs servern på -> http://localhost:3000/health

* API - Endpoints

**Students**
- `GET /api/students` -> Lista alla studenter
- `GET /api/students/:id` -> Hämta en student
- `POST /api/students` -> Skapa en ny student

**Attendance**
- `POST /api/attendance/mark` -> Markera närvaro
- `GET /api/attendance/student/:id` -> Närvaro för student
- `GET /api/attendance/course/:id` -> Närvaro för kurs

**Meta**
- `GET /api/meta/counts` -> Statistik (antal studenter, kurser, registreringar, närvaro)
- `GET /api/meta/attendance-rate/course/:id` -> Närvaroprocent för kurs


```
