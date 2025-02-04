import birdService from "../services/birdService";
import express, { Request, Response } from "express";
import { TypedRequest, TypedResponse, BirdBody, BirdIdRequest, GuessRequest, UserRequest, GameState, Bird } from "../requestTypes";

class birdController {
    async getBirdOfTheDay(req:Request, res:Response) {
        try {
            const bird = await birdService.getBirdOfTheDay();
            res.status(200).send({bird: bird});
            return;
        } catch (error) {
            res.status(500).send({error: error});
            return;
        }
    }

    async getBirdById(req:any, res:Response) {
        try {
            const id = req.query.id;
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

    async getUserState(req:any, res:Response) {
        try {
            const id = req.query.userId;
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