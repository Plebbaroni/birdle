import express, { Request, Response } from "express";
import cors from "cors";
import session, { Session } from "express-session";
import Redis from "ioredis";
import {RedisStore} from "connect-redis";

// Initialize Redis client
const redisClient = new Redis({
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  host: process.env.REDIS_HOST || "localhost",
});

redisClient.on("error", (err: Error) => console.error("Redis Client Error", err));

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*", credentials: true }));
app.use(express.json({ limit: "20mb" }));

// Session middleware
app.use(
  session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "your-secret-key",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Routes
/*const birdRoutes = require("./routes/birdRoutes");
app.use("/api", birdRoutes);
*/
// Global error handler
app.use((err:Error, req:Request, res:Response, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Export the app for testing or other setups
export default app