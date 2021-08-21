import { Connection } from "typeorm";
import { testCon } from "./testCon";
require("events").EventEmitter.defaultMaxListeners = 0;
let conn: Connection;
beforeAll(async () => {
  conn = await testCon(true);
});

afterAll(async () => {
  if (conn) {
    await conn.close();
  }
});
