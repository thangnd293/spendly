import { SQLiteDatabase } from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

import { getCategoryById } from './category';

export type TransactionType = 'spend' | 'income';

export type TransactionInput = {
  type: TransactionType;
  occurredOn: string;
  amountVnd: number;
  accountId: string;
  categoryId: string;
  payee?: string | null;
  note?: string | null;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  occurredOn: string;
  amountVnd: number;
  accountId: string;
  accountName: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  payee: string | null;
  note: string | null;
};

export type GroupedTransactionItem = {
  id: string;
  type: TransactionType;
  occurredOn: string;
  amountVnd: number;
  accountId: string;
  accountName: string;
  accountIcon: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  title: string;
  note: string | null;
};

export type GroupedTransactionsByDate = {
  date: string;
  totalAmountVnd: number;
  transactions: GroupedTransactionItem[];
};

export type TransactionBalanceSummary = {
  openingBalanceVnd: number;
  closingBalanceVnd: number;
  changeVnd: number;
};

export type GroupedTransactionsResult = {
  transactions: GroupedTransactionsByDate[];
};

async function assertValid(db: SQLiteDatabase, input: TransactionInput) {
  if (!Number.isInteger(input.amountVnd) || input.amountVnd <= 0) {
    throw new Error('Invalid amountVnd');
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(input.occurredOn)) {
    throw new Error('Invalid occurredOn');
  }

  const category = await getCategoryById(db, input.categoryId);

  if (!category) {
    throw new Error('Invalid categoryId');
  }

  if (category.kind !== input.type) {
    throw new Error('Category kind does not match transaction type');
  }

  const account = await db.getFirstAsync<{ isArchived: number }>(
    /*sql*/ `
      SELECT is_archived AS "isArchived"
      FROM account
      WHERE id = ?
    `,
    input.accountId,
  );

  if (!account || account.isArchived) {
    throw new Error('Invalid accountId');
  }
}

export async function insertTransaction(db: SQLiteDatabase, input: TransactionInput) {
  await assertValid(db, input);

  const id = Crypto.randomUUID();
  const result = await db.runAsync(
    /*sql*/ `
    INSERT INTO "transaction" (
        id, type, occurred_on, year_month, amount_vnd, account_id, category_id, payee, note, created_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`,
    id,
    input.type,
    input.occurredOn,
    input.occurredOn.slice(0, 7),
    input.amountVnd,
    input.accountId,
    input.categoryId,
    input.payee?.trim() ?? null,
    input.note?.trim() ?? null,
    new Date().toISOString(),
  );

  if (result.changes !== 1) throw new Error('Failed to insert transaction');
  return id;
}

function formatDateForQuery(date: Date) {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid transaction date filter');
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export async function getTransactionBalanceSummary(
  db: SQLiteDatabase,
  from: Date | null,
  to: Date | null,
): Promise<TransactionBalanceSummary> {
  const fromDate = from ? formatDateForQuery(from) : null;
  const toDate = to ? formatDateForQuery(to) : null;

  if (fromDate && toDate && fromDate > toDate) {
    throw new RangeError('Transaction date filter "from" must not be after "to"');
  }

  const balances = await db.getFirstAsync<{
    openingBalanceVnd: number;
    closingBalanceVnd: number;
  }>(
    /* SQL */ `
      SELECT
        COALESCE(SUM(
          CASE WHEN ? IS NULL OR a.opening_on <= ? THEN a.opening_balance_vnd ELSE 0 END
        ), 0) + COALESCE(SUM(
          CASE WHEN ? IS NULL THEN 0 ELSE (
            SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount_vnd ELSE -t.amount_vnd END)
            FROM "transaction" t
            WHERE t.account_id = a.id
              AND t.type IN ('spend', 'income')
              AND t.occurred_on >= a.opening_on
              AND t.occurred_on < ?
          ) END
        ), 0) AS "openingBalanceVnd",
        COALESCE(SUM(
          CASE WHEN ? IS NULL OR a.opening_on <= ? THEN a.opening_balance_vnd ELSE 0 END
        ), 0) + COALESCE(SUM(
          (
            SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount_vnd ELSE -t.amount_vnd END)
            FROM "transaction" t
            WHERE t.account_id = a.id
              AND t.type IN ('spend', 'income')
              AND t.occurred_on >= a.opening_on
              AND (? IS NULL OR t.occurred_on <= ?)
          )
        ), 0) AS "closingBalanceVnd"
      FROM account a
    `,
    fromDate,
    fromDate,
    fromDate,
    fromDate,
    toDate,
    toDate,
    toDate,
    toDate,
  );

  const openingBalanceVnd = balances?.openingBalanceVnd ?? 0;
  const closingBalanceVnd = balances?.closingBalanceVnd ?? 0;

  return {
    openingBalanceVnd,
    closingBalanceVnd,
    changeVnd: closingBalanceVnd - openingBalanceVnd,
  };
}

export async function listGroupedTransactions(
  db: SQLiteDatabase,
  from: Date | null,
  to: Date | null,
): Promise<GroupedTransactionsByDate[]> {
  const conditions = ["t.type IN ('spend', 'income')"];
  const parameters: string[] = [];
  const fromDate = from ? formatDateForQuery(from) : null;
  const toDate = to ? formatDateForQuery(to) : null;

  if (fromDate && toDate && fromDate > toDate) {
    throw new RangeError('Transaction date filter "from" must not be after "to"');
  }

  if (fromDate) {
    conditions.push('t.occurred_on >= ?');
    parameters.push(fromDate);
  }

  if (toDate) {
    conditions.push('t.occurred_on <= ?');
    parameters.push(toDate);
  }

  const rows = await db.getAllAsync<GroupedTransactionItem>(
    /* SQL */ `
    SELECT
      t.id,
      t.type,
      t.occurred_on AS "occurredOn",
      t.amount_vnd AS "amountVnd",
      t.account_id AS "accountId",
      a.name AS "accountName",
      a.icon AS "accountIcon",
      t.category_id AS "categoryId",
      c.name AS "categoryName",
      c.icon AS "categoryIcon",
      COALESCE(NULLIF(TRIM(t.payee), ''), c.name, 'Khác') AS title,
      t.note
    FROM "transaction" t
    LEFT JOIN account a ON t.account_id = a.id
    LEFT JOIN category c ON t.category_id = c.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY t.occurred_on DESC, t.created_at DESC
  `,
    ...parameters,
  );

  const groups = new Map<string, GroupedTransactionsByDate>();

  for (const row of rows) {
    const date = row.occurredOn.slice(0, 10);
    let group = groups.get(date);

    if (!group) {
      group = { date, totalAmountVnd: 0, transactions: [] };
      groups.set(date, group);
    }

    if (row.type === 'income') group.totalAmountVnd += row.amountVnd;
    else if (row.type === 'spend') group.totalAmountVnd -= row.amountVnd;

    group.transactions.push(row);
  }

  return Array.from(groups.values());
}
