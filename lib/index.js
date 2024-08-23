"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthorizationHeader = void 0;
const encrypt_1 = __importDefault(require("./encrypt"));
exports.createAuthorizationHeader = encrypt_1.default;
