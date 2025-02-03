import birdRepository from "../repository/birdRepository";
import {Bird} from "../requestTypes"
import redisClient from "../config/redis";

class birdService {
    private static readonly REDIS_CACHE_KEY = "bird_of_the_day";

    async getBirdOfTheDay(): Promise<Bird|null> {
        const bird = await redisClient.get(birdService.REDIS_CACHE_KEY)
        if (bird) {
            return(JSON.parse(bird));
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

    async guessBird(): Promise<boolean|null> {

    }
}

export default new birdService();