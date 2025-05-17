import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env["UPSTASH_REDIS_REST_URL"]
const redisToken = process.env["UPSTASH_REDIS_REST_TOKEN"]
console.log(redisUrl);

if (!redisUrl || !redisToken) {
  throw new Error('Missing UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN in environment variables');
}

const redisClient = new Redis({
  url: redisUrl,
  token: redisToken,
});

export default redisClient;