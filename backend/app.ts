import express, { Request, Response } from "express";
import cors from "cors";
import session, { Session } from "express-session";
import {RedisStore} from "connect-redis";
import redisClient from "./config/redis";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import router from "./routes/routes";
import { GameState } from "./requestTypes";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

// Initialize Express app
const app = express();
const SERVER_PORT = 5181;

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*", credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  let userId = req.cookies.userId;

  if (!userId) {
    userId = uuidv4(); // Generate a unique UUID
    res.cookie("userId", userId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  req.userId = userId;
  
  /*try {
    const gameState = await redisClient.get(userId);
    
    if (gameState) {
      req.gameState = JSON.parse(gameState) as GameState;
    } else {
      await redisClient.set(`user:${userId}:state`, JSON.stringify('ONGOING'), 'EX', 86400);
    }
  } catch (error) {
    console.error('Failed to confirm gamestate');
  }*/
 
  next();
});

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
app.use("/api", router);

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