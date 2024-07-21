import { Kysely, MysqlDialect } from "kysely";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { createPool } from "mysql2";

const dialect = new MysqlDialect({
  pool: createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }),
});

export default defineConfig({
  kysely: new Kysely<unknown>({ dialect }),
  migrations: {
    getMigrationPrefix: getKnexTimestampPrefix,
  },
});
