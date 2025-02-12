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
        const birdOfTheDay = await this.getBirdOfTheDay();

        if (!id || !birdOfTheDay) {
            throw new Error('Failed to fetch and compare birds');
        }

        const guesses = await this.incrementUserGuess(userId);
        let retval = await this.getUserState(userId); //should be ONGOING

        if (!retval) {
            throw new Error('Failed to fetch gamestate');
        }

        const bird = await this.getBirdById(id);

        if (!bird) {
            throw new Error('Failed to fetch bird');
        }

        await this.addBirdToGuesses(bird, userId);
        
        if (bird.id === birdOfTheDay.id) { //win
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

    async addBirdToGuesses(bird:Bird, userId:string) {
        await redisClient.rpush(`user:${userId}:guessArray`, JSON.stringify(bird));
    }

    async getBirdGuesses(userId:string): Promise<Bird[]|null> {
        const birdList = await redisClient.lrange(`user:${userId}:guessArray`, 0, -1);
        const birds:Bird[] = birdList.map(birdString => JSON.parse(birdString));
        if (!birds) {
            return null;
        }
        return birds
    }
}

export default new birdService();