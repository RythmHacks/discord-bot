declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASEKEY: string;
            UNSPLASHKEY: string;
            TOKEN: string;
            CLIENTID: sring;
            ENV?: "prod" | "dev";
        }
    }
}

export {};
