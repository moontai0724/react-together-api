import { databaseConfigs } from "configs";
import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { createPool, type PoolOptions } from "mysql2";

import type { Database } from "./schemas";

const config: PoolOptions = {
  host: databaseConfigs.host,
  user: databaseConfigs.user,
  password: databaseConfigs.password,
  port: databaseConfigs.port,
  database: databaseConfigs.database,
  connectionLimit: 100,
};

const dialect = new MysqlDialect({
  pool: createPool({
    ...config,
    typeCast(field, next) {
      if (field.type === "LONGLONG") {
        const value = field.string();

        if (!value) return null;

        return BigInt(value);
      }

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
  log: ["error"],
});
