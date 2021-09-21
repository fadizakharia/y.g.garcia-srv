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
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = jwks_rsa_1.default({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});
function getKey(header, callback) {
    client.getSigningKey(header.kid, function (_, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}
function isTokenValid(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (token) {
            const bearerToken = token.split(" ");
            const result = new Promise((resolve, _) => {
                jsonwebtoken_1.default.verify(bearerToken[1], getKey, {
                    audience: process.env.API_IDENTIFIER,
                    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
                    algorithms: ["RS256"],
                }, (error, decoded) => {
                    if (error) {
                        resolve({ error });
                    }
                    if (decoded) {
                        resolve({ decoded });
                    }
                });
            });
            return result;
        }
        return { error: "No token provided" };
    });
}
exports.default = isTokenValid;
//# sourceMappingURL=validate.js.map