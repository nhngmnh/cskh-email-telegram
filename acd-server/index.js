import express from 'express'
const app = express();
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('ACD Server is running without Kafka!');
});

app.listen(port, () => {
  console.log(`ACD Server is listening on port ${port}`);
});
