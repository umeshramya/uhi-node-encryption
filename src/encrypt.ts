import * as crypto from 'crypto';

// Define types for options and return values
interface CreateSigningStringResult {
    signingStringHashed: string;
    created: string;
    expires: string;
}

interface CreateAuthorizationHeaderOptions {
    message: string;
    PRIVATE_KEY: string;
    SUB_ID: string;
    KEY_ID: string;
}

// Generate a hash using SHA-512
const generateHash = async (message: string): Promise<string> => {
    const hash = crypto.createHash('sha512');
    hash.update(message);
    return hash.digest('base64');
};

// Sign the message using the private key
const signMessage = async (signingString: string, privateKey: string): Promise<string> => {
    const privateKeyObject = crypto.createPrivateKey({
        key: Buffer.from(privateKey, 'base64'),
        format: 'der',
        type: 'pkcs8',
    });
    const signedMessage = crypto.sign(null, Buffer.from(signingString), privateKeyObject);
    return signedMessage.toString('base64');
};

// Create the signing string
const createSigningString = async (message: string, created?: string, expires?: string): Promise<CreateSigningStringResult> => {
    if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
    if (!expires) expires = (parseInt(created) + 1 * 60 * 60).toString(); // 1 hour expiry

    const messageBase64 = await generateHash(message);

    const signingString = `created=${created}&expires=${expires}&digest=SHA-512=${messageBase64}`;
    const signingStringHashed = await generateHash(signingString);

    return {
        signingStringHashed,
        created,
        expires,
    };
};

// Create the authorization header
const createAuthorizationHeader = async (options: CreateAuthorizationHeaderOptions): Promise<string> => {
    if (!options.PRIVATE_KEY || !options.SUB_ID || !options.KEY_ID) {
        throw new Error('Missing required environment variables');
    }

    const { signingStringHashed, expires, created } = await createSigningString(options.message);
    const signature = await signMessage(signingStringHashed, options.PRIVATE_KEY);

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
};

export default createAuthorizationHeader;






