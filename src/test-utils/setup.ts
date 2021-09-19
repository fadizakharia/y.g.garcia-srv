import { createConnection } from "typeorm";
// import { Connection } from "typeorm";
// import { testCon } from "./testCon";
require("events").EventEmitter.defaultMaxListeners = 0;
// import { testCon } from "./testCon";

createConnection("test").then(() => process.exit());

// let conn: Connection;
// beforeAll(async () => {
//   // conn = await testCon();
// });

// afterAll(async () => {
//   // if (conn) {
//   //   await conn.close();
//   // }
// });
