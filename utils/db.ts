import type { SQLiteDatabase } from 'expo-sqlite';

const files = require.context('../data/migrations', false, /\/v\d+\.ts/);

function versionOf(key: string) {
  const found = key.match(/v(\d+)\.ts$/);

  if (!found) throw new Error(`Mirgation file name is not valid: ${key}`);
  return Number(found[1]);
}

const migrations = files
  .keys()
  .map((key) => ({
    version: versionOf(key),
    up: files(key).up as (db: SQLiteDatabase) => Promise<void>,
  }))
  .sort((a, b) => a.version - b.version);

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    `);

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= version) continue;

    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.execAsync(`PRAGMA user_version = ${migration.version}`);
    });

    version = migration.version;
  }
}
