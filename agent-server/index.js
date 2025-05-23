import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load .env từ ./agent-server/.env

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Agent Server is running');
});

app.listen(port, () => {
  console.log(`Agent Server listening on port ${port}`);
});
