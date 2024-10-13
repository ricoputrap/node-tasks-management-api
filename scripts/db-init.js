const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('./database.db');

const CREATE_TABLE_USER = `
  CREATE TABLE IF NOT EXISTS USER (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
    active BOOLEAN NOT NULL DEFAULT 1
  );
`;
db.exec(CREATE_TABLE_USER);

const CREATE_TABLE_TASK = `
  CREATE TABLE IF NOT EXISTS TASK (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT CHECK(status IN ('todo', 'in-progress', 'done')) NOT NULL DEFAULT 'todo',
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER (id)
  );
`;
db.exec(CREATE_TABLE_TASK);

db.close();