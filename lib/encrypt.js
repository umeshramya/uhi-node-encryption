"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
// Generate a hash using SHA-512
const generateHash = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = crypto.createHash('sha512');
    hash.update(message);
    return hash.digest('base64');
});
// Sign the message using the private key
const signMessage = (signingString, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const privateKeyObject = crypto.createPrivateKey({
        key: Buffer.from(privateKey, 'base64'),
        format: 'der',
        type: 'pkcs8',
    });
    const signedMessage = crypto.sign(null, Buffer.from(signingString), privateKeyObject);
    return signedMessage.toString('base64');
});
// Create the signing string
const createSigningString = (message, created, expires) => __awaiter(void 0, void 0, void 0, function* () {
    if (!created)
        created = Math.floor(new Date().getTime() / 1000).toString();
    if (!expires)
        expires = (parseInt(created) + 1 * 60 * 60).toString(); // 1 hour expiry
    const messageBase64 = yield generateHash(message);
    const signingString = `created=${created}&expires=${expires}&digest=SHA-512=${messageBase64}`;
    const signingStringHashed = yield generateHash(signingString);
    return {
        signingStringHashed,
        created,
        expires,
    };
});
// Create the authorization header
const createAuthorizationHeader = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.PRIVATE_KEY || !options.SUB_ID || !options.KEY_ID) {
        throw new Error('Missing required environment variables');
    }
    const { signingStringHashed, expires, created } = yield createSigningString(options.message);
    const signature = yield signMessage(signingStringHashed, options.PRIVATE_KEY);
    const subscriberId = options.SUB_ID;
    const uniqueKeyId = options.KEY_ID;
    const headerParts = {
        keyId: `${subscriberId}|${uniqueKeyId}|ed25519`,
        algorithm: 'ed25519',
        created,
        expires,
        headers: '(created) (expires) digest',
        signature,
    };
    return JSON.stringify(headerParts);
});
exports.default = createAuthorizationHeader;
