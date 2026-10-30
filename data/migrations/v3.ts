import type { SQLiteDatabase } from 'expo-sqlite';

export async function up(db: SQLiteDatabase) {
  await db.execAsync(/* sql */ `
    INSERT OR IGNORE INTO category (id, name, kind, parent_id, sort_order, icon) VALUES
      ('cat_food', 'Ăn uống', 'spend', NULL, 0, 'icon_119.png'),
      ('cat_sport', 'Thể thao', 'spend', NULL, 1, 'icon_119.png'),
      ('cat_move', 'Di chuyển', 'spend', NULL, 2, 'icon_119.png'),
      ('cat_bill', 'Hóa đơn & Tiện ích', 'spend', NULL, 3, 'icon_119.png'),
      ('cat_shop', 'Mua sắm', 'spend', NULL, 4, 'icon_119.png'),
      ('cat_entertainment', 'Giải trí', 'spend', NULL, 5, 'icon_119.png'),
      ('cat_income', 'Thu nhập', 'income', NULL, 0, 'icon_119.png');

    INSERT OR IGNORE INTO category (id, name, kind, parent_id, sort_order, icon) VALUES
      ('cat_food_coffee', 'Cà phê', 'spend', 'cat_food', 0, 'icon_119.png'),
      ('cat_food_meal', 'Ăn hàng', 'spend', 'cat_food', 1, 'icon_119.png'),
      ('cat_move_grab', 'Grab / taxi', 'spend', 'cat_move', 0, 'icon_119.png'),
      ('cat_move_fuel', 'Xăng xe', 'spend', 'cat_move', 1, 'icon_119.png'),
      ('cat_bill_power', 'Tiền điện', 'spend', 'cat_bill', 0, 'icon_119.png'),
      ('cat_shop_clothes', 'Quần áo', 'spend', 'cat_shop', 0, 'icon_119.png'),
      ('cat_entertainment_movie', 'Xem phim', 'spend', 'cat_entertainment', 0, 'icon_119.png'),
      ('cat_income_salary', 'Lương', 'income', 'cat_income', 0, 'icon_119.png'),
      ('cat_income_bonus', 'Thưởng', 'income', 'cat_income', 1, 'icon_119.png');

    INSERT OR IGNORE INTO "transaction" (
      id, type, occurred_on, year_month, account_id, amount_vnd, category_id, payee, note, created_at
    ) VALUES
      (
        'seed_tx_001', 'spend',
        strftime('%Y-%m-%dT08:15:00', 'now', 'localtime'),
        strftime('%Y-%m', 'now', 'localtime'),
        'acc_cash', 45000, 'cat_food_coffee', 'Cà phê sáng', 'Cà phê và bánh mì',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_002', 'spend',
        strftime('%Y-%m-%dT12:20:00', 'now', 'localtime'),
        strftime('%Y-%m', 'now', 'localtime'),
        'acc_cash', 85000, 'cat_food_meal', 'Ăn trưa', 'Cơm văn phòng',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_003', 'spend',
        strftime('%Y-%m-%dT18:30:00', 'now', 'localtime', '-1 day'),
        strftime('%Y-%m', 'now', 'localtime', '-1 day'),
        'acc_cash', 32000, 'cat_move_grab', 'GrabBike', NULL,
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_004', 'spend',
        strftime('%Y-%m-%dT19:00:00', 'now', 'localtime', '-2 days'),
        strftime('%Y-%m', 'now', 'localtime', '-2 days'),
        'acc_cash', 180000, 'cat_food_meal', 'Ăn tối', 'Ăn tối cùng bạn',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_005', 'spend',
        strftime('%Y-%m-%dT09:10:00', 'now', 'localtime', '-3 days'),
        strftime('%Y-%m', 'now', 'localtime', '-3 days'),
        'acc_cash', 50000, 'cat_move_fuel', 'Đổ xăng', NULL,
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_006', 'spend',
        strftime('%Y-%m-%dT20:00:00', 'now', 'localtime', '-5 days'),
        strftime('%Y-%m', 'now', 'localtime', '-5 days'),
        'acc_cash', 220000, 'cat_entertainment_movie', 'Xem phim', 'Vé xem phim cuối tuần',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_007', 'spend',
        strftime('%Y-%m-%dT08:40:00', 'now', 'localtime', '-7 days'),
        strftime('%Y-%m', 'now', 'localtime', '-7 days'),
        'acc_cash', 39000, 'cat_food_coffee', 'Cà phê', NULL,
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_008', 'spend',
        strftime('%Y-%m-%dT17:30:00', 'now', 'localtime', '-10 days'),
        strftime('%Y-%m', 'now', 'localtime', '-10 days'),
        'acc_cash', 350000, 'cat_shop_clothes', 'Mua áo', 'Áo thun',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_009', 'spend',
        strftime('%Y-%m-%dT10:00:00', 'now', 'localtime', '-14 days'),
        strftime('%Y-%m', 'now', 'localtime', '-14 days'),
        'acc_cash', 120000, 'cat_bill_power', 'Tiền điện', 'Chia tiền điện tháng này',
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      ),
      (
        'seed_tx_010', 'spend',
        strftime('%Y-%m-%dT19:45:00', 'now', 'localtime', '-21 days'),
        strftime('%Y-%m', 'now', 'localtime', '-21 days'),
        'acc_cash', 95000, 'cat_food_meal', 'Ăn tối', NULL,
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      );
  `);
}
