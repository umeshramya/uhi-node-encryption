interface CreateAuthorizationHeaderOptions {
    message: string;
    PRIVATE_KEY: string;
    SUB_ID: string;
    KEY_ID: string;
}
declare const createAuthorizationHeader: (options: CreateAuthorizationHeaderOptions) => Promise<string>;
export default createAuthorizationHeader;
