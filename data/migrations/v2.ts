import type { SQLiteDatabase } from 'expo-sqlite';

export async function up(db: SQLiteDatabase) {
  await db.execAsync(/* sql */ `
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('cash', 'bank')),
      icon TEXT,
      opening_balance_vnd INTEGER NOT NULL,
      opening_on TEXT NOT NULL,
      is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0, 1))
    );

    CREATE TABLE "transaction" (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('spend', 'income', 'transfor', 'lend', 'collect')),
      occurred_on TEXT NOT NULL,
      year_month TEXT NOT NULL,
      account_id TEXT NOT NULL REFERENCES account(id),
      to_account_id TEXT REFERENCES account(id),
      amount_vnd INTEGER NOT NULL CHECK (amount_vnd > 0),
      category_id TEXT REFERENCES category(id),
      claim_id TEXT,
      payee TEXT,
      note TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX idx_transaction_year_month ON "transaction"(year_month);
    CREATE INDEX idx_transaction_category ON "transaction"(category_id);
    CREATE INDEX idx_transaction_account ON "transaction"(account_id);
    CREATE INDEX idx_transaction_claim ON "transaction"(claim_id);

    INSERT INTO account (
      id, name, kind, icon, opening_balance_vnd, opening_on, is_archived
    ) VALUES (
      'acc_cash', 'Tiền mặt', 'cash', 'icon_109.png', 2000000, '2026-10-07', 0
    )
`);
}
