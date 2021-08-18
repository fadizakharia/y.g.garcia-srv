import { createConnection } from "typeorm";

export const testCon = (drop: boolean = false) =>
  createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "fadizakharia",
    password: "doomknight123.",
    database: "nomar_test",
    synchronize: drop,
    dropSchema: drop,
    entities: ["src/Entity/*.ts"],
    migrations: ["database/migrations/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/Entity",
      migrationsDir: "database/migrations",
      subscribersDir: "src/subscriber",
    },
  });
