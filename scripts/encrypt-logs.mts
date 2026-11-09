// Encrypts private/applications.json into the payload that ships with /logs.
// Run with `pnpm logs:encrypt`; the password comes from LOGS_PASSWORD in .env.local.
import { readFile, writeFile } from "node:fs/promises";
import { encryptJson } from "../src/features/job-log/lib/crypto.ts";

const SOURCE = "private/applications.json";
const TARGET = "src/features/job-log/applications.enc.json";

const password = process.env.LOGS_PASSWORD;
if (!password) {
  console.error("Set LOGS_PASSWORD in .env.local first.");
  process.exit(1);
}

const applications = JSON.parse(await readFile(SOURCE, "utf8"));
const payload = await encryptJson(applications, password);
await writeFile(TARGET, JSON.stringify(payload) + "\n");
console.log(`Encrypted ${applications.length} applications into ${TARGET}.`);
