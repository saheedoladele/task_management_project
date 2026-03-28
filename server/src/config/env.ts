import dotenv from "dotenv";

dotenv.config();

function parseOrigins(raw: string | undefined): string[] | true {
  if (!raw?.trim()) {
    return true;
  }
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3001", 10),
  corsOrigin: parseOrigins(process.env.CORS_ORIGIN),
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-only-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  db: {
    /** Full Postgres URL (e.g. Render `DATABASE_URL`). When set, host/user/password/db are ignored. */
    databaseUrl: process.env.DATABASE_URL?.trim() || undefined,
    /** Set to `false` only if your URL points to a server that does not use TLS. */
    sslEnabled:
      process.env.DB_SSL !== "false" && process.env.DB_SSL !== "0",
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    username: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_NAME ?? "taskmanager",
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.DB_LOGGING === "true",
  },
};
