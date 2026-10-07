import Database from "@tauri-apps/plugin-sql";
import { MIGRATIONS } from "./migrations";

export class DomainError extends Error {}

let ready: Promise<Database> | null = null;

/** Opens the DB once and runs pending migrations. Safe to call repeatedly (React StrictMode). */
export function getDb(): Promise<Database> {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  return ready;
}

async function init(): Promise<Database> {
  const db = await Database.load("sqlite:projectos.db");
  const [{ user_version }] = await db.select<{ user_version: number }[]>("PRAGMA user_version");
  for (let v = user_version; v < MIGRATIONS.length; v++) {
    for (const stmt of MIGRATIONS[v]) await db.execute(stmt);
    await db.execute(`PRAGMA user_version = ${v + 1}`);
  }
  return db;
}

export async function q<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return (await getDb()).select<T[]>(sql, params);
}
export async function run(sql: string, params: unknown[] = []) {
  return (await getDb()).execute(sql, params);
}

export const newId = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
