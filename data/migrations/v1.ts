import type { SQLiteDatabase } from 'expo-sqlite';

export async function up(db: SQLiteDatabase) {
  await db.execAsync(/* sql */ `
    CREATE TABLE IF NOT EXISTS category (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('spend', 'income')),
        parent_id TEXT REFERENCES category(id),
        sort_order INTEGER NOT NULL DEFAULT 0,
        icon TEXT NOT NULL
    );
`);
}
