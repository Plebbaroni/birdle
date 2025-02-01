import db from "../config/db";

class birdRepository {
    async getBirdById(id: number) {
        return db.rpc('SELECT * FROM birds where id = $1', [id]);
    }
}