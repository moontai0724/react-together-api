import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { createPool, type PoolOptions } from "mysql2";
import { env } from "persistance";

import type { Database } from "./schemas";

const config: PoolOptions = {
  host: env.database.host,
  user: env.database.user,
  password: env.database.password,
  port: env.database.port,
  database: env.database.database,
  connectionLimit: 100,
};

const dialect = new MysqlDialect({
  pool: createPool({
    ...config,
    // Map tinyint(1) to boolean
    typeCast(field, next) {
      if (field.type === "TINY" && field.length === 1) {
        return field.string() === "1";
      }

      return next();
    },
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
