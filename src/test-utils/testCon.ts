// import { createConnection } from "typeorm";
// import { Book } from "../entity/Book";
// import { BookImages } from "../entity/BookImages";
// import { Category } from "../entity/Category";
// import { Character } from "../entity/Character";
// import { CharacterImages } from "../entity/CharacterImages";
// import { PurchaseOption } from "../entity/PurchaseOption";

// export const testCon = (drop: boolean = false) =>
//   createConnection({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     name: "test",
//     username: "fadizakharia",
//     password: "doomknight123.",
//     database: "nomar_test",
//     synchronize: drop,
//     dropSchema: drop,
//     entities: [
//       Book,
//       Character,
//       Category,
//       BookImages,
//       CharacterImages,
//       PurchaseOption,
//     ],
//     migrations: ["database/migrations/**/*.ts"],
//     subscribers: ["src/subscriber/**/*.ts"],
//     cli: {
//       entitiesDir: "src/entity",
//       migrationsDir: "database/migrations",
//       subscribersDir: "src/subscriber",
//     },
//   });
