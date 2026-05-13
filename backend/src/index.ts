import { openDb, ensureSchema } from './db.js';
import { createServer } from './server.js';

const PORT = Number(process.env.PORT) || 4000;
const db = openDb();
ensureSchema(db);

const app = createServer(db);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`marketingqr backend listening on :${PORT}`);
});
