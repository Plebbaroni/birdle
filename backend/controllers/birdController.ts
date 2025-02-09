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
                res.status(400).send({error: "Invalid Id"});
                return;
            }
            const bird = await birdService.getBirdById(id);
            res.status(200).send({bird: bird});
            return;

        } catch (error) {
            res.status(500).send({error: error});
            return;
        }
    }

    async guessBird(req:Request, res:Response) {
        try {
            const { birdId } = req.body;
            const userId = req.userId
            if (!birdId || !userId) {
                res.status(400).send({error: "Invalid input"});
                return;
            }

            const state = await birdService.guessBird(birdId, userId);
            res.status(200).send({state: state});
            return;
        } catch (error) {
            res.status(500).send({error: error});
            return;
        }
    }

    async getUserState(req:any, res:Response) {
        try {
            const id = req.query.userId;
            if (!id) {
                res.status(400).send({error: "Invalid input"});
                return;
            }

            const state = await birdService.getUserState(id);
            res.status(200).send({state:state});
            return;
        } catch (error) {
            res.status(500).send({error: error});
            return;
        }
    }
}

export default new birdController();