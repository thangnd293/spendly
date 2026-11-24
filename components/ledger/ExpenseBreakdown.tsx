import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Banknote,
  BriefcaseMedical,
  Ellipsis,
  Gamepad2,
  House,
  ReceiptText,
  ShoppingBasket,
} from 'lucide-react-native';

import { Text, VStack, HStack } from '@/components/ui';
import { formatMoney } from '@/utils/money';
import ExpenseDonut, { type DonutItem } from './ExpenseDonut';

// TODO: thay bằng data thật (gộp theo category trong range đang chọn)
const DATA: DonutItem[] = [
  { key: 'home', label: 'Nhà cửa', value: 1_916_000, color: '#26465e', icon: House },
  { key: 'food', label: 'Đi chợ', value: 1_255_000, color: '#3ec9a7', icon: ShoppingBasket },
  { key: 'cash', label: 'Tiền mặt', value: 1_057_000, color: '#14a9e8', icon: Banknote },
  { key: 'game', label: 'Giải trí', value: 727_000, color: '#f2c12e', icon: Gamepad2 },
  { key: 'health', label: 'Sức khỏe', value: 595_000, color: '#f0432a', icon: BriefcaseMedical },
  { key: 'bill', label: 'Hóa đơn', value: 330_000, color: '#fb8c6b', icon: ReceiptText },
  { key: 'other', label: 'Khác', value: 727_000, color: '#9aa0a6', icon: Ellipsis },
];

type Props = {
  data?: DonutItem[];
  onPressDetail?: () => void;
};

export default function ExpenseBreakdown({ data = DATA, onPressDetail }: Props) {
  const router = useRouter();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <VStack className="mx-4 mt-4 rounded-xl bg-surface p-4" space="md">
      <HStack className="items-start justify-between">
        <VStack>
          <Text className="font-semibold" size="xl">
            Khoản chi
          </Text>
          <Text className="font-semibold text-negative" size="lg">
            {formatMoney(total)}
          </Text>
        </VStack>
        <Pressable hitSlop={8} onPress={onPressDetail}>
          <Text className="font-semibold text-positive">Xem chi tiết</Text>
        </Pressable>
      </HStack>

      <ExpenseDonut data={data} />
    </VStack>
  );
}
