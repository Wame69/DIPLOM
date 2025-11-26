const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'subtrackr.db');

// Проверяем существование файла БД
const fs = require('fs');
const dataDir = path.dirname(DB_FILE);

console.log('🔍 Checking database...');
console.log('Database path:', DB_FILE);
console.log('Data directory exists:', fs.existsSync(dataDir));
console.log('Database file exists:', fs.existsSync(DB_FILE));

if (fs.existsSync(DB_FILE)) {
  console.log('📊 Database file found, checking tables...');
  
  const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
      console.error('❌ Error opening database:', err.message);
      return;
    }
    console.log('✅ Connected to SQLite database');
    
    // Проверяем существование таблиц
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.error('❌ Error checking tables:', err.message);
        return;
      }
      
      console.log('📋 Found tables:', tables.map(t => t.name));
      
      // Проверяем структуру notifications_log
      if (tables.some(t => t.name === 'notifications_log')) {
        db.all("PRAGMA table_info(notifications_log)", (err, columns) => {
          if (err) {
            console.error('❌ Error checking notifications_log structure:', err.message);
            return;
          }
          console.log('📝 notifications_log columns:', columns.map(c => `${c.name} (${c.type})`));
          db.close();
        });
      } else {
        console.log('❌ Table notifications_log not found!');
        db.close();
      }
    });
  });
} else {
  console.log('❌ Database file does not exist!');
}