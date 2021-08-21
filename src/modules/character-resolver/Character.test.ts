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
const deleteCharacterMutation = `
mutation deleteCharacter($deleteId:String!){
  deleteCharacter(id:$deleteId)
}
`;
let conn: Connection;

beforeAll(async () => {
  conn = getConnection();
});
describe("test suite for getting characters", () => {
  it("should get all characters", () => {});
  // it("should get all characters based on category", () => {});
  // it("should fail to get characters due to non existant category", () => {});
  //add after adding category-resolver
});
describe("test suite for getting character", () => {});
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
describe("tests for deleting characters", () => {
  it("should delete character", async () => {
    const testCharacter = await createCharacter(conn);
    const res = await gqlRequest(deleteCharacterMutation, {
      deleteId: testCharacter.id,
    });
    expect(res.data.deleteCharacter).toBeTruthy();
  });
  it("should fail to delete character due to a validation error", async () => {
    const res = await gqlRequest(deleteCharacterMutation, {
      deleteId: "invalid-id-213123",
    });
    expect(res.errors[0].message).toBe("Invalid id!");
  });
});
// describe("tests for adding character to category", () => {

// });
//add after category-resolver
