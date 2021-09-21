"use strict";
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
const typeorm_1 = require("typeorm");
const graphqlCall_1 = require("../../test-utils/graphqlCall");
const shared_1 = require("../../test-utils/shared");
const faker_1 = __importDefault(require("faker"));
const moment_1 = __importDefault(require("moment"));
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
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = typeorm_1.getConnection("test");
}));
describe("test suite for getting characters", () => {
    it("should get all characters", () => { });
});
describe("test suite for getting character", () => { });
describe("test suite for adding character", () => {
    it("should add character", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield graphqlCall_1.gqlRequest(addCharacterMutation, {
            AddCharacterInput: {
                name: "commander zakharia",
                bio: "a really awesome magnificent powerful and scary leader, some may say everyone is a potato but him.",
                date_of_birth: moment_1.default().subtract(20, "years").toISOString(),
                ethnicity: "caucasian",
                gender: "male",
                color: "golden",
            },
        });
        console.log(res.data);
        expect(res.data.createCharacter.character).toBeDefined();
    }));
    it("should fail to add character due to validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield graphqlCall_1.gqlRequest(addCharacterMutation, {
            AddCharacterInput: {
                name: "co",
                bio: "test",
                date_of_birth: moment_1.default().add(20, "years").toISOString(),
                ethnicity: "a",
                gender: "test",
                color: "a",
            },
        });
        expect(res.data.createCharacter.errors.length).toBe(6);
    }));
});
describe("test suite for updating characters", () => {
    it("should successfully update a character", () => __awaiter(void 0, void 0, void 0, function* () {
        const testCharacter = yield shared_1.createCharacter(conn);
        const res = yield graphqlCall_1.gqlRequest(updateCharacterMutation, {
            UpdateCharacterInput: {
                id: testCharacter.id,
                name: faker_1.default.lorem.words(2),
                bio: faker_1.default.lorem.lines(1),
                date_of_birth: moment_1.default().subtract(20, "years").toISOString(),
                ethnicity: faker_1.default.lorem.word(8),
                gender: "male",
                color: faker_1.default.lorem.word(8),
            },
        });
        console.log(res.errors);
        expect(res.data.updateCharacter.character).toBeDefined();
    }));
    it("should fail to update character due to validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const testCharacter = yield shared_1.createCharacter(conn);
        const res = yield graphqlCall_1.gqlRequest(updateCharacterMutation, {
            UpdateCharacterInput: {
                id: testCharacter.id,
                name: "co",
                bio: "test",
                date_of_birth: moment_1.default().add(20, "years").toISOString(),
                ethnicity: "a",
                gender: "test",
                color: "a",
            },
        });
        expect(res.data.updateCharacter.errors.length).toBe(6);
    }));
});
describe("tests for deleting characters", () => {
    it("should delete character", () => __awaiter(void 0, void 0, void 0, function* () {
        const testCharacter = yield shared_1.createCharacter(conn);
        const res = yield graphqlCall_1.gqlRequest(deleteCharacterMutation, {
            deleteId: testCharacter.id,
        });
        console.log(res.errors);
        expect(res.data.deleteCharacter).toBeTruthy();
    }));
    it("should fail to delete character due to a validation error", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield graphqlCall_1.gqlRequest(deleteCharacterMutation, {
            deleteId: "invalid-id-213123",
        });
        expect(res.errors[0].message).toBe("Invalid id!");
    }));
});
//# sourceMappingURL=Character.test.js.map