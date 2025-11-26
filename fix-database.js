const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'subtrackr.db');

console.log('🔧 Fixing database structure...');

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    return;
  }
  
  console.log('✅ Connected to database');
  
  // Исправляем структуру notifications_log
  db.serialize(() => {
    // Переименовываем колонку read в read_status
    console.log('🔄 Renaming column "read" to "read_status"...');
    
    db.run(`ALTER TABLE notifications_log RENAME COLUMN "read" TO "read_status"`, (err) => {
      if (err) {
        console.log('ℹ️ Column already renamed or different name');
      } else {
        console.log('✅ Column renamed successfully');
      }
      
      // Проверяем текущую структуру
      db.all("PRAGMA table_info(notifications_log)", (err, columns) => {
        if (err) {
          console.error('❌ Error checking table structure:', err.message);
          return;
        }
        
        console.log('📝 Current notifications_log columns:');
        columns.forEach(col => {
          console.log(`   - ${col.name} (${col.type})`);
        });
        
        console.log('🎉 Database fix completed!');
        db.close();
      });
    });
  });
});