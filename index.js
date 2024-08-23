const createAuthorizationHeader = require("./encrypt");

// Export as CommonJS
module.exports = {
    createAuthorizationHeader,
};


(async () => {
    const PRIVATE_KEY = "MC4CAQAwBQYDK2VwBCIEIKre6VrdWv6SzZtZPh/YSe4PJD5lut4JNUWWyaAvf86m"
    const SUB_ID = "nice.hspa"
    const KEY_ID = "nice.hspa.k1"
        try {
            const message = "Your message here"; // Replace with your actual message
            const authHeader = await createAuthorizationHeader({"KEY_ID":KEY_ID, "PRIVATE_KEY" :PRIVATE_KEY, "SUB_ID" : SUB_ID, "message" : message});
            console.log("Authorization Header:", authHeader);
        } catch (error) {
            console.error("Error creating authorization header:", error);
        }
    })();