import "reflect-metadata";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { DataSource } from "typeorm";
import { Task } from "../entities/task.entity.js";
import { User } from "../entities/user.entity.js";
import { env } from "./env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** CLI loads `.ts`; production runs compiled `.js` from `dist/`. */
const migrationExt = import.meta.url.endsWith(".ts") ? "ts" : "js";

const common = {
  type: "postgres" as const,
  synchronize: env.db.synchronize,
  logging: env.db.logging,
  entities: [User, Task],
  migrations: [path.join(__dirname, "..", "migrations", `*.${migrationExt}`)],
  migrationsTableName: "typeorm_migrations",
};

/** Render / managed Postgres require TLS; local dev usually does not. */
function sslOption() {
  if (!env.db.databaseUrl) {
    return false;
  }
  if (!env.db.sslEnabled) {
    return false;
  }
  return { rejectUnauthorized: false };
}

const AppDataSource = new DataSource(
  env.db.databaseUrl
    ? {
        ...common,
        url: env.db.databaseUrl,
        ssl: sslOption(),
      }
    : {
        ...common,
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        ssl: false,
      },
);

export default AppDataSource;
