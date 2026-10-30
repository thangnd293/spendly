import { SQLiteDatabase } from 'expo-sqlite';

export type Account = {
  id: string;
  name: string;
  icon?: string;
  openingBalanceVnd: number;
  openingOn: string;
  isArchived: boolean;
};

export async function listActiveAccounts(db: SQLiteDatabase) {
  return await db.getAllAsync<Account>(/* SQL */ `
      SELECT id, name, kind, icon, opening_balance_vnd AS openingBalanceVnd, opening_on AS openingOn, is_archived AS isArchived
      FROM account
      ORDER BY name
  `);
}

export async function getAccountById(db: SQLiteDatabase, id: string | null) {
  return await db.getFirstAsync<Account>(
    /* SQL */ `
      SELECT id, name, kind, icon, opening_balance_vnd AS openingBalanceVnd, opening_on AS openingOn, is_archived AS isArchived
      FROM account
      WHERE id = ?
    `,
    id,
  );
}
