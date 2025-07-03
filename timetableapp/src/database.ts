import * as sqlite3 from "sqlite3";

const db = new sqlite3.Database("./schedule.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      classroom TEXT,
      teacher TEXT,
      date DATE NOT NULL,
      time TEXT NOT NULL
    )
  `);
});

export default db;