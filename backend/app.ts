import express, { Request, Response } from "express";
import cors from "cors";
import session, { Session } from "express-session";
import {RedisStore} from "connect-redis";
import redisClient from "./config/redis";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

// Initialize Express app
const app = express();
const SERVER_PORT = 5180;

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
app.use((err:Error, req:Request, res:Response, next:any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port http://localhost:${SERVER_PORT}`);
});

// Export the app for testing or other setups
export default app