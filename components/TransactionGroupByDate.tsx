import { GroupedTransactionItem } from '@/data/transaction';
import { View } from 'react-native';
import TransactionItem from './TransactionItem';
import { Text, HStack, VStack } from './ui';
import { formatMoney } from '@/utils/money';

type TransactionGroupByDateProps = {
  date: string;
  totalAmount: number;
  transactions: GroupedTransactionItem[];
};
export default function TransactionGroupByDate({
  date,
  totalAmount,
  transactions,
}: TransactionGroupByDateProps) {
  const { day, weekday, month, year } = parseDateInfo(date);

  return (
    <View className="overflow-hidden rounded-3xl bg-surface">
      <HStack className="justify-between p-3">
        <HStack space="md" className="items-center">
          <Text size="4xl">{day}</Text>
          <View>
            <Text bold size="sm" className="text-muted">
              {weekday}
            </Text>
            <Text size="sm" className="text-muted">
              tháng {month} {year}
            </Text>
          </View>
        </HStack>

        <Text bold>{formatMoney(totalAmount)}</Text>
      </HStack>
      <VStack>
        {transactions.map((item) => (
          <TransactionItem
            key={item.id}
            id={item.id}
            title={item.title}
            amount={item.amountVnd}
            type={item.type}
            note={item.note ?? undefined}
            categoryIcon={item.categoryIcon}
            accountIcon={item.accountIcon}
          />
        ))}
      </VStack>
    </View>
  );
}

function parseDateInfo(dateStr: string) {
  const date = new Date(dateStr);

  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const weekday = weekdays[date.getDay()];

  // Tính hôm nay và hôm qua
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // So sánh theo ngày/tháng/năm
  const isToday =
    day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

  const isYesterday =
    day === yesterday.getDate() &&
    month === yesterday.getMonth() + 1 &&
    year === yesterday.getFullYear();

  let displayWeekday = weekday;
  if (isToday) {
    displayWeekday = 'Hôm nay';
  } else if (isYesterday) {
    displayWeekday = 'Hôm qua';
  }

  return {
    day,
    month,
    year,
    weekday: displayWeekday,
  };
}
