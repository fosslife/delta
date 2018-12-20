const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.resolve(__dirname, '../storage', 'db.json'));
const db = lowdb(adapter);

module.exports = db;
