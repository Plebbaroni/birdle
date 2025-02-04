import {Request} from "express";
import { GameState } from "./requestTypes";
declare module "express-serve-static-core" {
    interface Request {
      userId?: string;
      gameState: GameState;
    }
}