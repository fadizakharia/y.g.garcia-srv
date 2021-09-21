"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.CharacterResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Character_1 = require("../../entity/Character");
const input_1 = require("./add-character/input");
const validation_1 = require("./add-character/validation");
const CharacterResponse_1 = require("./character-response/CharacterResponse");
const input_2 = require("./update-character/input");
const validation_2 = require("./update-character/validation");
const moment_1 = __importDefault(require("moment"));
const validation_3 = require("./delete-character/validation");
const Category_1 = require("../../entity/Category");
const CharactersResponse_1 = require("./character-response/CharactersResponse");
let CharacterResolver = class CharacterResolver {
    getCharacters(categoryId, page, step) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = typeorm_1.getManager();
            console.log(page, step);
            try {
                let foundCharacters;
                let total = 0;
                let result;
                if (categoryId) {
                    const foundCategory = yield manager.findOne(Category_1.Category, categoryId);
                    if (foundCategory) {
                        result = yield manager.findAndCount(Character_1.Character, {
                            where: { category: foundCategory },
                            skip: page * step,
                            take: step,
                            relations: ["category", "images"],
                        });
                        foundCharacters = result[0];
                        total = result[1];
                    }
                    else {
                        throw new Error("category does not exist!");
                    }
                }
                else {
                    result = yield manager.findAndCount(Character_1.Character, {
                        skip: page * step,
                        take: step,
                        relations: ["category", "images"],
                    });
                    foundCharacters = result[0];
                    total = result[1];
                }
                if (foundCharacters && foundCharacters.length > 0) {
                    return {
                        total,
                        characters: foundCharacters,
                    };
                }
                throw new Error("could not find characters!");
            }
            catch (err) {
                throw new Error("something went wrong!");
            }
        });
    }
    createCharacter(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = [];
            yield validation_1.addCharacterValidator
                .validate(Object.assign({}, arg), { abortEarly: false })
                .catch(function (err) {
                err.inner.forEach((e) => {
                    error.push({ field: e.path, message: e.message });
                });
            });
            if (!moment_1.default(arg.date_of_birth, moment_1.default.ISO_8601, true).isValid()) {
                error.push({ field: "date_of_birth", message: "not a valid date" });
            }
            else {
                if (moment_1.default(arg.date_of_birth).isSameOrAfter(moment_1.default())) {
                    error.push({ field: "date_of_birth", message: "not a valid date" });
                }
            }
            if (error.length > 0) {
                return { errors: error };
            }
            try {
                let savedCharacter;
                const manager = typeorm_1.getManager();
                let newArg = {};
                if (!arg.category) {
                    console.log("im here");
                    Object.assign(newArg, Object.assign(Object.assign({}, arg), { date_of_birth: moment_1.default(arg.date_of_birth)
                            .format("MM-DD-YYYY")
                            .toString(), category: null }));
                    const createdCharacter = manager.create(Character_1.Character, newArg);
                    savedCharacter = yield manager.save(createdCharacter);
                    console.log(savedCharacter);
                }
                else {
                    console.log("im here");
                    const foundCategory = yield manager.findOne(Category_1.Category, arg.category);
                    console.log(foundCategory);
                    if (foundCategory) {
                        Object.assign(newArg, Object.assign(Object.assign({}, arg), { date_of_birth: moment_1.default(arg.date_of_birth)
                                .format("MM-DD-YYYY")
                                .toString() }));
                        const createdCharacter = manager.create(Character_1.Character, newArg);
                        console.log("1");
                        savedCharacter = yield manager.save(createdCharacter);
                        foundCategory.characters.push(savedCharacter);
                        yield manager.save(foundCategory);
                        console.log("2");
                    }
                    else {
                        throw new Error("category does not exist!");
                    }
                }
                if (savedCharacter) {
                    return { character: savedCharacter };
                }
                else {
                    throw new Error("something went wrong!");
                }
            }
            catch (err) {
                throw new Error("something went wrong!" + err);
            }
        });
    }
    updateCharacter(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = [];
            yield validation_2.updateCharacterValidator
                .validate(Object.assign({}, arg), { abortEarly: false })
                .catch(function (err) {
                err.inner.forEach((e) => {
                    error.push({ field: e.path, message: e.message });
                });
            });
            if (!moment_1.default(arg.date_of_birth, moment_1.default.ISO_8601, true).isValid()) {
                error.push({ field: "date_of_birth", message: "not a valid date" });
            }
            else {
                if (moment_1.default(arg.date_of_birth).isSameOrAfter(moment_1.default())) {
                    error.push({ field: "date_of_birth", message: "not a valid date" });
                }
            }
            if (error.length > 0) {
                return { errors: error };
            }
            try {
                const manager = typeorm_1.getManager();
                const foundCharacter = yield manager.findOne(Character_1.Character, arg.id);
                if (foundCharacter) {
                    if (arg.date_of_birth) {
                        Object.assign(foundCharacter, Object.assign(Object.assign(Object.assign({}, foundCharacter), arg), { date_of_birth: moment_1.default(arg.date_of_birth).toDate() }));
                    }
                    else {
                        Object.assign(foundCharacter, Object.assign(Object.assign({}, foundCharacter), arg));
                    }
                    if (arg.category) {
                        const foundCategory = yield manager.findOne(Category_1.Category, arg.category);
                        Object.assign(foundCharacter, Object.assign(Object.assign(Object.assign({}, foundCharacter), arg), { category: foundCategory }));
                    }
                    else {
                        if (foundCharacter.category) {
                            Object.assign(foundCharacter, Object.assign(Object.assign(Object.assign({}, foundCharacter), arg), { category: null }));
                        }
                    }
                    const updatedCharacter = yield manager.save(foundCharacter);
                    return { character: updatedCharacter };
                }
                else {
                    throw new Error("Character does not exist!");
                }
            }
            catch (err) {
                throw new Error("Something went wrong! please try again later.");
            }
        });
    }
    deleteCharacter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = yield validation_3.idValidation.isValid(id);
            if (!valid) {
                throw new Error("Invalid id!");
            }
            try {
                const manager = typeorm_1.getManager();
                const foundCharacter = yield manager.findOne(Character_1.Character, id);
                if (!foundCharacter) {
                    throw new Error("could not find character!");
                }
                yield manager.remove(Character_1.Character, foundCharacter);
                return true;
            }
            catch (err) {
                throw new Error("Something went wrong!");
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => CharactersResponse_1.CharactersResponse),
    __param(0, type_graphql_1.Arg("cat", () => String, { nullable: true })),
    __param(1, type_graphql_1.Arg("page", () => Number, { defaultValue: 0 })),
    __param(2, type_graphql_1.Arg("step", () => Number, { defaultValue: 10 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "getCharacters", null);
__decorate([
    type_graphql_1.Mutation(() => CharacterResponse_1.CharacterResponse),
    type_graphql_1.Authorized("add:character"),
    __param(0, type_graphql_1.Arg("addCharacterInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_1.AddCharacterInput]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "createCharacter", null);
__decorate([
    type_graphql_1.Authorized(["update:character"]),
    type_graphql_1.Mutation(() => CharacterResponse_1.CharacterResponse),
    __param(0, type_graphql_1.Arg("updateCharacterInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_2.UpdateCharacterInput]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "updateCharacter", null);
__decorate([
    type_graphql_1.Authorized(["delete:character"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "deleteCharacter", null);
CharacterResolver = __decorate([
    type_graphql_1.Resolver()
], CharacterResolver);
exports.CharacterResolver = CharacterResolver;
//# sourceMappingURL=character.resolver.js.map