import { Connection, getConnection } from "typeorm";
import { gqlRequest } from "../../test-utils/graphqlCall";
import { createCharacter } from "../../test-utils/shared";
import faker from "faker";
import moment from "moment";
// import { testCon } from "../../test-utils/testCon";

const addCharacterMutation = `
mutation addCharacter($AddCharacterInput: AddCharacterInput!){
  createCharacter(addCharacterInput: $AddCharacterInput) {
    character {
      bio
      color
      date_of_birth
      ethnicity
      gender
      id
      name
    }
    errors {
      field
      message
    }
  }
}
`;
const updateCharacterMutation = `
mutation updateCharacter($UpdateCharacterInput: UpdateCharacterInput!){
  updateCharacter(updateCharacterInput: $UpdateCharacterInput) {
    character {
      bio,
      color,
      date_of_birth,
      ethnicity,
      gender,
      name
    },
    errors {
      field
      message
    }
  }
}
`;
let conn: Connection;

beforeAll(async () => {
  conn = getConnection();
});
describe("test suite for adding character", () => {
  it("should add character", async () => {
    const res = await gqlRequest(addCharacterMutation, {
      AddCharacterInput: {
        name: "commander zakharia",
        bio: "a really awesome magnificent powerful and scary leader, some may say everyone is a potato but him.",
        date_of_birth: moment().subtract(20, "years").toISOString(),
        ethnicity: "caucasian",
        gender: "male",
        color: "golden",
      },
    });

    expect(res.data.createCharacter.character).toBeDefined();
  });
  it("should fail to add character due to validation", async () => {
    const res = await gqlRequest(addCharacterMutation, {
      AddCharacterInput: {
        name: "co",
        bio: "test",
        date_of_birth: moment().add(20, "years").toISOString(),
        ethnicity: "a",
        gender: "test",
        color: "a",
      },
    });

    expect(res.data.createCharacter.errors.length).toBe(6);
  });
});
describe("test suite for updating characters", () => {
  it("should successfully update a character", async () => {
    const testCharacter = await createCharacter(conn);
    const res = await gqlRequest(updateCharacterMutation, {
      UpdateCharacterInput: {
        id: testCharacter.id,
        name: faker.lorem.words(2),
        bio: faker.lorem.lines(1),
        date_of_birth: moment().subtract(20, "years").toISOString(),
        ethnicity: faker.lorem.word(8),
        gender: "male",
        color: faker.lorem.word(8),
      },
    });
    expect(res.data.updateCharacter.character).toBeDefined();
  });
  it("should fail to update character due to validation", async () => {
    const testCharacter = await createCharacter(conn);
    const res = await gqlRequest(updateCharacterMutation, {
      UpdateCharacterInput: {
        id: testCharacter.id,
        name: "co",
        bio: "test",
        date_of_birth: moment().add(20, "years").toISOString(),
        ethnicity: "a",
        gender: "test",
        color: "a",
      },
    });

    expect(res.data.updateCharacter.errors.length).toBe(6);
  });
});
