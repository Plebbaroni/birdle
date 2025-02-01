import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); 

const supabaseUrl = process.env["SUPABASE_URL"] || "INVALID";
const supabaseKey = process.env["SUPABASE_KEY"] || "INVALID";

const supabase = createClient(supabaseUrl, supabaseKey);

const testConnection = async () => {
  const { data, error } = await supabase.from('birds').select('*').limit(1);
  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Supabase connection successful:', data);
  }
};

testConnection();

export default supabase;