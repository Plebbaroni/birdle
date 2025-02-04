import express from "express"
import birdController from "../controllers/birdController"

const router = express.Router();

router.get("/today-bird", birdController.getBirdOfTheDay);

export default router;