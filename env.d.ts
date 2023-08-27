declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASEKEY: string;
            UNSPLASHKEY: string;
            TOKEN: string;
            CLIENTID: string;
            CLIENTSECRET: string;
            PORT: number,
            ENV?: "prod" | "dev";
        }
    }
}

export {};
