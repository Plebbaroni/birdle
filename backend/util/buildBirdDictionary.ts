import db from "../config/db";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = import.meta.dirname

async function fetchAndBuild() {
    const { data, error } = await db
    .from('birds')
    .select('id, common_name');

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  const hashmap = Object.fromEntries(data.map(row => [row.common_name, row.id]));

  const filePath = path.join(__dirname, './birds.json');
  fs.writeFileSync(filePath, JSON.stringify(hashmap, null, 2), 'utf-8');

}

fetchAndBuild();