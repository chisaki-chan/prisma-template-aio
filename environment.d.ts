namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    DATABASE_URL_1: string;
    DATABASE_URL_2: string;
    DATABASE_URL_3: string;
    JWT_SECRET: string;
    FE_URL: string;
    BE_URL: string;
    MODE: 'development' | 'production';
  }
}
