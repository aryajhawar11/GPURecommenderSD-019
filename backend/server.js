import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const redis = new Redis("redis://default:XB4Hu8brzea0bnKojohjO67gPZXxVb9I@redis-17441.c282.east-us-mz.azure.redns.redis-cloud.com:17441"); // Connects to Redis on localhost:6379 by default
const CACHE_DURATION = 900; // 15 minutes in seconds

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/gpu-pricing', async (req, res) => {
  const { region } = req.query;

  if (!region) {
    return res.status(400).json({ error: 'Region is required' });
  }

  const cacheKey = `gpu-pricing:${region}`;

  try {
    // Check Redis cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from external API
    const response = await axios.get(
      'https://customer.acecloudhosting.com/api/v1/pricing',
      {
        params: {
          is_gpu: true,
          resource: 'instances',
          region: region,
        },
      }
    );

    // Cache the data in Redis
    await redis.set(cacheKey, JSON.stringify(response.data), 'EX', CACHE_DURATION);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GPU pricing:', error.message);
    res.status(500).json({ error: 'Failed to fetch GPU pricing' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
