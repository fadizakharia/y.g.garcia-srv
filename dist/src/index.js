"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const body_parser_1 = require("body-parser");
const dotenv = __importStar(require("dotenv"));
const buildSchema_1 = require("./util/buildSchema");
const typeorm_1 = require("typeorm");
const graphql_upload_1 = require("graphql-upload");
dotenv.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT || 5000;
    const app = express_1.default();
    let retries = 5;
    while (retries) {
        try {
            yield typeorm_1.createConnection(process.env.NODE_ENV === "development" ? "test" : "default");
            break;
        }
        catch (err) {
            console.log(err);
            retries -= 1;
            console.log("retries left " + retries);
            yield new Promise((res) => setTimeout(res, 5000));
        }
    }
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield buildSchema_1.createSchema(),
        context: ({ req, res }) => {
            const context = {
                req,
                res,
            };
            return context;
        },
        introspection: true,
    });
    yield apolloServer.start();
    app.use(cors_1.default({
        credentials: true,
    }));
    app.use("/graphql", body_parser_1.json());
    app.use(graphql_upload_1.graphqlUploadExpress({ maxFileSize: 10000000 }));
    apolloServer.applyMiddleware({
        app,
        cors: true,
    });
    app.listen(PORT, () => {
        console.log("started on" + PORT);
    });
});
main();
//# sourceMappingURL=index.js.map