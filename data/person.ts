import * as Crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

export type Person = {
  id: string;
  name: string;
  avatarUrl: string | null;
  isArchived: boolean;
};

export type NewPersonInput = {
  name: string;
  avatarUrl?: string | null;
};

type PersonRow = Omit<Person, 'isArchived'> & {
  isArchived: number;
};

export async function listPeople(db: SQLiteDatabase): Promise<Person[]> {
  const rows = await db.getAllAsync<PersonRow>(/* SQL */ `
    SELECT id, name, avatarUrl, is_archived AS isArchived
    FROM person
    ORDER BY name
  `);

  return rows.map(toPerson);
}

export async function getPeopleByIds(db: SQLiteDatabase, ids: string[]): Promise<Person[]> {
  if (ids.length === 0) return [];

  const placeholders = ids.map(() => '?').join(', ');
  const rows = await db.getAllAsync<PersonRow>(
    /* SQL */ `
      SELECT id, name, avatarUrl, is_archived AS isArchived
      FROM person
      WHERE id IN (${placeholders})
    `,
    ...ids,
  );
  const peopleById = new Map(rows.map((row) => [row.id, toPerson(row)]));

  return ids.flatMap((id) => {
    const person = peopleById.get(id);
    return person ? [person] : [];
  });
}

export async function insertPerson(db: SQLiteDatabase, input: NewPersonInput) {
  const name = input.name.trim();
  if (!name) throw new Error('Tên người không được để trống');

  const id = Crypto.randomUUID();
  const result = await db.runAsync(
    /* SQL */ `
      INSERT INTO person (id, name, avatarUrl)
      VALUES (?, ?, ?)
    `,
    id,
    name,
    input.avatarUrl?.trim() || null,
  );

  if (result.changes !== 1) throw new Error('Thêm người không thành công');

  return id;
}

function toPerson(row: PersonRow): Person {
  return {
    ...row,
    isArchived: row.isArchived !== 0,
  };
}
