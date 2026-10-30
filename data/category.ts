import { SQLiteDatabase } from 'expo-sqlite';

export type CategoryKind = 'spend' | 'income';

export type Category = {
  id: string;
  name: string;
  kind: CategoryKind;
  parentId: string | null;
  sortOrder: number;
  icon: string;
};

export type NewCategoryInput = Omit<Category, 'id' | 'sortOrder'>;

type CategoryRow = {
  id: string;
  name: string;
  kind: CategoryKind;
  parent_id: string | null;
  sort_order: number;
  icon: string;
};

export async function insertCategory(db: SQLiteDatabase, input: NewCategoryInput) {
  const name = input.name.trim();
  const id = toCatSnakeCase(`${input.parentId ?? 'cat'} ${name}`);

  const result = await db.runAsync(
    /* SQL */ `
    INSERT INTO category (
        id, name, kind, parent_id, sort_order, icon
    )
    VALUES (
        ?, ?, ?, ?,
        COALESCE(
            (
                SELECT MAX(sort_order) + 1
                FROM category
                WHERE parent_id IS ?
            ),
            0
        ),
    ?
    )`,
    id,
    name,
    input.kind,
    input.parentId,
    input.parentId,
    input.icon,
  );

  if (result.changes !== 1) throw new Error('Tạo nhóm không thành công');

  return id;
}

export async function listParentCategories(db: SQLiteDatabase, kind: CategoryKind) {
  const rows = await db.getAllAsync<CategoryRow>(
    /* SQL */ `
        SELECT id, name, kind, parent_id, sort_order, icon
        FROM category
        WHERE parent_id IS NULL and kind = ?
        ORDER BY sort_order, name
        `,
    kind,
  );

  return rows.map(toCategory);
}

export async function getCategoryById(db: SQLiteDatabase, id: string | null) {
  const row = await db.getFirstAsync<CategoryRow>(
    /* SQL */ `
        SELECT id, name, kind, parent_id, sort_order, icon
        FROM category
        WHERE id = ?
        `,
    id,
  );

  return row && toCategory(row);
}

export async function listCategories(db: SQLiteDatabase, kind: CategoryKind) {
  const rows = await db.getAllAsync<CategoryRow>(
    /* SQL */ `
        SELECT id, name, kind, parent_id, sort_order, icon
        FROM category
        WHERE kind = ?
        ORDER BY sort_order, name
        `,
    kind,
  );

  return rows.map(toCategory);
}

function toCategory(categoryRow: CategoryRow): Category {
  return {
    id: categoryRow.id,
    name: categoryRow.name,
    kind: categoryRow.kind,
    parentId: categoryRow.parent_id,
    sortOrder: categoryRow.sort_order,
    icon: categoryRow.icon,
  };
}

function toCatSnakeCase(name: string) {
  return (
    name
      // chuẩn hóa Unicode để tách dấu
      .normalize('NFD')
      // loại bỏ dấu tiếng Việt (các ký tự tổ hợp)
      .replace(/[\u0300-\u036f]/g, '')
      // chuyển hết về lowercase
      .toLowerCase()
      // thay khoảng trắng, dấu gạch ngang, dấu chấm… bằng "_"
      .replace(/[\s\-\.]+/g, '_')
      // loại bỏ ký tự không hợp lệ (chỉ giữ a-z, 0-9, _)
      .replace(/[^a-z0-9_]/g, '')
      // bỏ dấu "_" thừa ở đầu/cuối
      .replace(/^_+|_+$/g, '')
  );
}
