import birdService from "../services/birdService";
import express, { Request, Response } from "express";
import { TypedRequest, TypedResponse, BirdBody, BirdIdRequest, GuessRequest, UserRequest, GameState, Bird } from "../requestTypes";

class birdController {
    async getBirdOfTheDay(req:Request, res:Response) {
        try {
            const bird = await birdService.getBirdOfTheDay();
            return res.status(200).json({bird: bird});
        } catch (error) {
            return res.status(500).json({error: error});
        }
    }

    async getBirdById(req:TypedRequest<BirdIdRequest>, res:Response) {
        try {
            const id = req.body.id;
            if (!id) {
                return res.status(400).json({error: "Invalid Id"});
            }
            const bird = await birdService.getBirdById(id);
            return res.status(200).json({bird: bird});

        } catch (error) {
            return res.status(500).json({error: error});
        }
    }

    async guessBird(req:TypedRequest<GuessRequest>, res:Response) {
        try {
            const { birdId, userId } = req.body;
            if (!birdId || !userId) {
                return res.status(400).json({error: "Invalid input"});
            }

            const state = await birdService.guessBird(birdId, userId);
            return res.status(200).json({state: state});
        } catch (error) {
            return res.status(500).json({error: error});
        }
    }

    async getUserState(req:TypedRequest<UserRequest>, res:Response) {
        try {
            const id = req.body.userId;
            if (!id) {
                return res.status(400).json({error: "Invalid input"});
            }

            const state = await birdService.getUserState(id);
            return res.status(200).json({state:state});
        } catch (error) {
            return res.status(500).json({error: error});
        }
    }
}

export default new birdController();