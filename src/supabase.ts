import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://lacnzqwmonhdmwmbtvih.supabase.co",
    process.env.SUPABASEKEY
);

export default supabase;
