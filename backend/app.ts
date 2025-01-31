const express = require("express");
const cors = require("cors");
const redis = require("ioredis");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

// Initialize Redis client
const redisClient = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);

// Initialize Redis store for sessions
const redisStore = new RedisStore({ client: redisClient, prefix: "session:" });

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
const birdRoutes = require("./routes/birdRoutes");
app.use("/api", birdRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Export the app for testing or other setups
export default app