DROP TABLE schedule

CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    classroom TEXT,
    teacher TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL
)