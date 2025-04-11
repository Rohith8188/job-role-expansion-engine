import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('✅ Job Role Expansion Engine Backend is Running');
  });
  
// Gemini API call logic
app.post('/api/expand', async (req, res) => {
  const { title } = req.body;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedText',
      {
        text: title,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY,
        },
      }
    );

    const embedding = response.data.embedding;

    // ✅ For now, send back just the vector
    res.json({ title, embedding });
  } catch (error) {
    console.error('Gemini error:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
