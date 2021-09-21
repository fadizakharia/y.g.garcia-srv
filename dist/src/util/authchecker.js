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
exports.customAuthChecker = void 0;
const validate_1 = __importDefault(require("./validate"));
const customAuthChecker = ({ context }, permissions) => __awaiter(void 0, void 0, void 0, function* () {
    let validity = false;
    if (context.req.headers["authorization"]) {
        const token = context.req.headers["authorization"];
        const decodedToken = (yield validate_1.default(token));
        if (decodedToken) {
            if (permissions && permissions.length > 0) {
                permissions.forEach((r) => {
                    if (decodedToken.decoded.permissions.includes(r)) {
                        validity = true;
                    }
                    else {
                        validity = false;
                    }
                });
            }
            else {
                validity = true;
            }
        }
        else {
            validity = false;
        }
    }
    else {
        validity = false;
    }
    return validity;
});
exports.customAuthChecker = customAuthChecker;
//# sourceMappingURL=authchecker.js.map