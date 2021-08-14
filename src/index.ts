import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import * as dotenv from "dotenv";
// const corsOption = { origin: "http://localhost:3000", credentials: true };
import { createSchema } from "./util/buildSchema";
import { createConnection } from "typeorm";

// import tokenValidator from "./util/tokenValidator";

dotenv.config();
const main = async () => {
  const PORT = process.env.PORT || 5000;
  const app: Express = express();
  const connection = await createConnection();

  // app.use(tokenValidator);

  const apolloServer = new ApolloServer({
    schema: await createSchema(),

    context: ({ req, res }) => {
      const context = {
        req,
        res,
        connection,
      };
      return context;
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      ...cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:4000",
          "http://localhost:5000",
        ],
        credentials: true,
      }),
    },
  });
  app.use(cors());
  app.listen(PORT, () => {
    console.log("started on" + PORT);
  });
};
main();
// bodyParser is needed just for POST.
