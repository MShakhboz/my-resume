import { EncryptedPayload } from "./lib/crypto";
import payload from "./applications.enc.json";

/** The log as committed: ciphertext only. Regenerate it with `pnpm logs:encrypt`. */
export const encryptedApplications = payload as EncryptedPayload;
