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
        const setUsed = birdRepository.setBirdIsUsed(bird.id);
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

    async guessBird(id: number, userId:string): Promise<boolean|null> {
        const playerGuess = await this.getBirdById(id);
        const birdOfTheDay = await this.getBirdOfTheDay();

        if (!playerGuess || !birdOfTheDay) {
            throw new Error('Failed to fetch and compare birds');
        }

        const guesses = await this.incrementUserGuess(userId);

        if (playerGuess === birdOfTheDay) {
            this.setUserState(userId, GameState.WON);
            return true;
        } else if (guesses === 5) { //maxguesses
            this.setUserState(userId, GameState.LOST);
        }
        return false;
    }

    async incrementUserGuess(userId:string):Promise<number|null> {
        const userGuess = await redisClient.incr(`user:${userId}:guesses`);
        return userGuess;
    }

    async GetUserGuess(userId:string): Promise<number|null> {
        const userGuess = await redisClient.get(`user:${userId}:guesses`);
        return userGuess ? parseInt(userGuess, 10) : 0
    }
    async setUserState(userId:string, state:GameState) {
        await redisClient.set(`user:${userId}:state`, state, "EX", 86400);
    }

    async getUserState(userId:string):Promise<string|null> {
        const userState = await redisClient.get(`user:${userId}:state`);
        return userState;
    }

}

export default new birdService();