// backend/db.js
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost', // replace with your MySQL host if needed
  user: 'root',
  password: '',
  database: 'goalgetter'
});

db.connect((err) => {
  if (err) {
    console.error('error connecting to the database:', err.stack);
    return;
  }
  console.log('connected to the database');
});

export default db;
