import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database";

const supabase = createClient(
    "https://lacnzqwmonhdmwmbtvih.supabase.co",
    process.env.SUPABASEKEY
);

export default supabase;
