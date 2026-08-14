/* =========================================================
   SUPABASE
   CRISTO VIVE – SULLANA
========================================================= */

const SUPABASE_URL =
    "https://mzjneglrasiulnbsotdj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
   "sb_publishable_OapOqAY2Fy2BBbkUetmqEA_RbaWNfQC";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase conectado:", supabaseClient);