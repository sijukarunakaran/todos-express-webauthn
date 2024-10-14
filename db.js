var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

// Set the database directory
const dbDir = '/tmp';
const dbPath = path.join(dbDir, 'todos.db');

const originalDbDir = './var/db';
if (fs.existsSync(originalDbDir)) {
  fs.readdirSync(originalDbDir).forEach(file => {
    const sourcePath = path.join(originalDbDir, file);
    const destPath = path.join('/tmp', file);
    fs.copyFileSync(sourcePath, destPath);
  });
}

// Open the SQLite database
var db = new sqlite3.Database(dbPath);

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    name TEXT, \
    handle BLOB UNIQUE \
  )");

  db.run("CREATE TABLE IF NOT EXISTS public_key_credentials ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    external_id TEXT UNIQUE, \
    public_key TEXT \
  )");

  db.run("CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )");
});

module.exports = db;
