import type { SQLiteDatabase } from 'expo-sqlite';

export async function up(db: SQLiteDatabase) {
  await db.execAsync(/* sql */ `
    CREATE TABLE IF NOT EXISTS person (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatarUrl TEXT,
      is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS split_group (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      total_vnd INTEGER NOT NULL CHECK (total_vnd > 0),
      my_share_vnd INTEGER NOT NULL CHECK (my_share_vnd >= 0),
      account_id TEXT NOT NULL REFERENCES account(id),
      category_id TEXT NOT NULL REFERENCES category(id),
      spend_txn_id TEXT REFERENCES "transaction"(id),
      occurred_at TEXT NOT NULL,
      CHECK ((my_share_vnd=0) = (spend_txn_id IS NULL))
    );

    CREATE TABLE IF NOT EXISTS claim (
      id TEXT PRIMARY KEY,
      person_id TEXT NOT NULL REFERENCES person(id),
      kind TEXT NOT NULL CHECK (kind IN ('loan', 'share')),
      amount_vnd INTEGER NOT NULL CHECK (amount_vnd > 0),
      group_id TEXT REFERENCES split_group(id),
      account_id TEXT NOT NULL REFERENCES account(id),
      note TEXT,
      opened_at TEXT NOT NULL,
      CHECK ((kind = 'share') = (group_id IS NOT NULL))
    );

    CREATE INDEX idx_txn_claim ON "transaction"(claim_id);
    CREATE INDEX idx_claim_person ON claim(person_id);
    CREATE INDEX idx_claim_group ON claim(group_id);
  `);
}
