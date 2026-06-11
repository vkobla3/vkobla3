import express from 'express';
import cors from 'cors';
import parlayRoutes from './routes/parlay.routes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/parlay', parlayRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
