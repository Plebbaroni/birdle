import birdService from "../services/birdService";
import { TypedRequest, TypedResponse, BirdBody, BirdIdRequest, GuessRequest, UserRequest, GameState } from "../requestTypes";
class birdController {
    async getBirdOfTheDay(req:Request, res:TypedResponse<BirdBody>) {

    }

    async getBirdById(req:TypedRequest<BirdIdRequest>, res:TypedResponse<BirdBody>) {

    }

    async guessBird(req:TypedRequest<GuessRequest>, res:TypedResponse<GameState>) {

    }

    async getUserState(req:TypedRequest<UserRequest>, res:TypedResponse<GameState>) {

    }
}