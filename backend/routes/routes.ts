import express from "express"
import birdController from "../controllers/birdController"

const router = express.Router();

router.get("/bird-today", birdController.getBirdOfTheDay);
router.get("/birdid", birdController.getBirdById);
router.get("/guess", birdController.guessBird);
router.get("/gamestate", birdController.getUserState);

export default router;