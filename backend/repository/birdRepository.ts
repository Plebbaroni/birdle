import db from "../config/db";
import { Bird, TypedResponse } from "../requestTypes"

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
      .order("random()")
      .limit(1)
      .single(); 

    if (error) {
      console.error("Error fetching bird of the day:", error);
    }

    if (!data) {
        return null;
    }

    return data;
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
        .update({is_used: true})

    if (error) {
        console.error("Error resetting is_used on all birds", error);
        return false;
    }

    return true;
  }
}

export default new BirdRepository();