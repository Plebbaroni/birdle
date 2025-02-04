import db from "../config/db";
import { Bird, TypedResponse } from "../requestTypes"
import Util from "../util/util";

class BirdRepository {

  async getBirdById(id: number): Promise<Bird | null> {
    const { data, error } = await db
      .from("birds")
      .select("*")
      .eq("id", id)
      .single(); 

    if (error) {
      console.error("Error fetching bird by ID:", error);
      return null;
    }

    return data;
  }

  async getBirdOfTheDay(): Promise<Bird|null> {
    const { data, error } = await db
      .from("birds")
      .select("*")
      .eq("is_used", false)

    if (error || !data) {
      console.error("Error fetching bird of the day:", error);
      return null;
    }

    if (data.length === 0) {
        const succ = await this.resetAllBirdsIsUsed();
        if (succ) {
            return this.getBirdOfTheDay();
        } else {
            console.error("Error fetching bird of the day:", error);
            return null;
        }
    }
    const newdata = Util.shuffleArray(data);
    return newdata[0];
  }

  async setBirdIsUsed(id:number): Promise<Boolean> {
    const {data, error} = await db
        .from("birds")
        .update({is_used: true})
        .eq("id", id);

    if (error) {
        console.error("Error updating is_used on bird:", error);
        return false;
    }

    return true;
  }

  async resetAllBirdsIsUsed(): Promise<Boolean> {
    const {data, error} = await db
        .from("birds")
        .update({is_used: false})
        .eq("is_used", true)

    if (error) {
        console.error("Error resetting is_used on all birds", error);
        return false;
    }

    return true;
  }
}

export default new BirdRepository();