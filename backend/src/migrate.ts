import { openDb, ensureSchema } from './db.js';

const db = openDb();
ensureSchema(db);
console.log('schema applied');
db.close();
