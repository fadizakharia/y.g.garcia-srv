"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("events").EventEmitter.defaultMaxListeners = 0;
typeorm_1.createConnection("test").then(() => process.exit());
//# sourceMappingURL=setup.js.map