// import { testCon } from "./testCon";

import { createConnection } from "typeorm";

createConnection().then(() => process.exit());
