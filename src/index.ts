import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { json } from "body-parser";
import * as dotenv from "dotenv";
// const corsOption = { origin: "http://localhost:3000", credentials: true };
import { createSchema } from "./util/buildSchema";
import { createConnection } from "typeorm";
import { graphqlUploadExpress } from "graphql-upload";

// import tokenValidator from "./util/tokenValidator";

dotenv.config();
const main = async () => {
  const PORT = process.env.PORT || 5000;
  const app: Express = express();

  let retries = 5;
  while (retries) {
    try {
      await createConnection(
        process.env.NODE_ENV === "development" ? "test" : "default"
      );
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log("retries left " + retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  // app.use(tokenValidator);

  const apolloServer = new ApolloServer({
    schema: await createSchema(),

    context: ({ req, res }) => {
      const context = {
        req,
        res,
      };
      return context;
    },
    introspection: true,
  });

  await apolloServer.start();
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use("/graphql", json());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000 }));
  apolloServer.applyMiddleware({
    app,
    cors: true,
  });
  app.listen(PORT, () => {
    console.log("started on" + PORT);
  });
};
main();
// bodyParser is needed just for POST.
