import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.get('/me', async (req, res) => {
  res.json({ message: 'Hello depuis le backend !' });
});

const PORT = process.env.PORT || 3310;
app.listen(PORT, () => {
  console.log(`⚡ Backend démarré sur http://localhost:${PORT}`);
});
