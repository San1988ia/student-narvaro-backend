# Student Attendance Backend

A REST API for managing student attendance, built with Node.js, Express and MySQL.

The project is structured with separate routes, services and data layers to keep the code organized and maintainable.

## Features

- List all students
- Get a student by ID
- Create a new student
- Register attendance
- View attendance for a student
- View attendance for a course
- Get statistics about students, courses, registrations and attendance
- Calculate attendance rate for a course

## Tech Stack

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- REST API
- ES Modules

## Project Structure

```text
student-narvaro-backend/
├── data/
│   ├── db.js
│   ├── studentsData.js
│   └── attendanceData.js
├── routes/
│   ├── studentsRoutes.js
│   ├── attendanceRoutes.js
│   └── metaRoutes.js
├── services/
│   ├── studentsService.js
│   └── attendanceService.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

The application follows a simple separation of concerns:

- `routes/` handles API endpoints
- `services/` contains application logic
- `data/` handles database queries and the MySQL connection

## API Endpoints

### Students

```text
GET /api/students
```

Returns all students.

```text
GET /api/students/:id
```

Returns a specific student.

```text
POST /api/students
```

Creates a new student.

### Attendance

```text
POST /api/attendance/mark
```

Registers attendance.

```text
GET /api/attendance/student/:id
```

Returns attendance data for a student.

```text
GET /api/attendance/course/:id
```

Returns attendance data for a course.

### Statistics

```text
GET /api/meta/counts
```

Returns statistics about students, courses, registrations and attendance.

```text
GET /api/meta/attendance-rate/course/:id
```

Returns the attendance percentage for a course.

### Health Check

```text
GET /health
```

Checks that the API is running.

## How to run

### 1. Clone the repository

```bash
git clone https://github.com/San1988ia/student-narvaro-backend.git
cd student-narvaro-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=studentnarvaro
PORT=3000
```

Make sure the MySQL database exists before starting the server.

### 4. Start the server

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

You can test the health endpoint at:

```text
http://localhost:3000/health
```

## What I learned

Through this project I gained more experience with:

- Building REST APIs with Node.js and Express
- Connecting a backend application to MySQL
- Writing asynchronous database queries with `mysql2/promise`
- Structuring backend code into routes, services and data layers
- Working with environment variables
- Handling JSON requests and responses
- Designing API endpoints for student attendance data

## Author

**Sania Dehghani Ekengren**  
Frontend Developer
