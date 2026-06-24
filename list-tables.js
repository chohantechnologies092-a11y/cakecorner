const db = require('better-sqlite3')('dev.db');
const tables = db.prepare("SELECT name FROM sqlite_schema WHERE type='table'").all();
console.log(tables);
