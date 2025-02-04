import birdRepository from "../repository/birdRepository";
import {Bird, GameState} from "../requestTypes"
import redisClient from "../config/redis";

class birdService {
    private static readonly REDIS_CACHE_KEY = "bird_of_the_day";

    async getBirdOfTheDay(): Promise<Bird|null> {
        const bird = await redisClient.get(birdService.REDIS_CACHE_KEY)
        if (bird) {
            return(JSON.parse(bird)) as Bird;
        }
        const newbird = await this.setBirdOfTheDay();

        if (newbird) {
            return newbird;
        }
        return null;
    }

    async setBirdOfTheDay(): Promise<Bird|null> {
        let bird = await birdRepository.getBirdOfTheDay();
        if (!bird) {
            const reset = await birdRepository.resetAllBirdsIsUsed();
            if (!reset) {
                throw new Error('Failed to reset all birds');
            }

            bird = await birdRepository.getBirdOfTheDay();
            if (!bird) {
                throw new Error('No available birds after reset... very weird!');
            }
        }
        const setUsed = await birdRepository.setBirdIsUsed(bird.id);
        if (!setUsed) {
            throw new Error('Failed to set bird used');
        }
        await redisClient.set(birdService.REDIS_CACHE_KEY, JSON.stringify(bird), 'EX', 86400);

        return bird;
    }

    async getBirdById(id:number): Promise<Bird|null> {
        let bird = await birdRepository.getBirdById(id);

        if (!bird) {
            throw new Error('Failed to fetch bird');
        }

        return bird;
    }

    async guessBird(id: number, userId:string): Promise<GameState|null> {
        const playerGuess = await this.getBirdById(id);
        const birdOfTheDay = await this.getBirdOfTheDay();

        if (!playerGuess || !birdOfTheDay) {
            throw new Error('Failed to fetch and compare birds');
        }

        const guesses = await this.incrementUserGuess(userId);
        let retval = await this.getUserState(userId); //should be ONGOING

        if (!retval) {
            throw new Error('Failed to fetch gamestate');
        }

        if (playerGuess === birdOfTheDay) { //win
            retval = await this.setUserState(userId, GameState.WON);
            return retval;
        } else if (guesses === 5) { //maxguesses
            retval = await this.setUserState(userId, GameState.LOST);
            return retval
        }

        return retval;
    }

    async incrementUserGuess(userId:string):Promise<number|null> {
        const userGuess = await redisClient.incr(`user:${userId}:guesses`);
        return userGuess;
    }

    async GetUserGuess(userId:string): Promise<number|null> {
        const userGuess = await redisClient.get(`user:${userId}:guesses`);
        return userGuess ? parseInt(userGuess, 10) : 0
    }
    async setUserState(userId:string, state:GameState):Promise<GameState> {
        await redisClient.set(`user:${userId}:state`, state, "EX", 86400);
        return state;
    }

    async getUserState(userId:string):Promise<GameState|null> {
        let userState = await redisClient.get(`user:${userId}:state`);
        if (!userState) {
            userState = await this.setUserState(userId, GameState.ONGOING);
        }
        return userState as GameState;
    }

}

export default new birdService();