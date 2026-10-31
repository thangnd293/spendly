import { formatMoney } from '@/utils/money';
import { Pressable, View } from 'react-native';
import { Image, Text, VStack } from './ui';
import { iconName, iconSource } from '@/utils/icons';
import { TransactionType } from '@/data/transaction';
import { tv } from 'tailwind-variants';
import { router } from 'expo-router';

type TransactionItemProps = {
  id: string;
  title: string;
  amount: number;
  categoryIcon: string;
  accountIcon: string;
  type: TransactionType;
  note?: string;
};

const amountStyle = tv({
  variants: {
    type: {
      income: 'text-income',
      spend: 'text-spend',
    },
  },
  defaultVariants: {
    type: 'income',
  },
});

export default function TransactionItem({
  id,
  title,
  amount,
  note,
  categoryIcon,
  accountIcon,
  type,
}: TransactionItemProps) {
  return (
    <Pressable
      className="flex-row gap-4 p-3 active:bg-black/10"
      onPress={() =>
        router.push({
          pathname: '/transaction/[id]',
          params: { id },
        })
      }
    >
      <View className="relative flex-shrink-0 self-center">
        <Image source={iconSource(categoryIcon)} alt={iconName(categoryIcon)} />
        <View className="absolute bottom-0 right-0 size-5 overflow-hidden rounded-full border border-white">
          <Image
            size="full"
            style={{ transform: [{ scale: 1.2 }] }}
            source={iconSource(accountIcon)}
            alt={iconName(accountIcon)}
          />
        </View>
      </View>
      <VStack className="flex-1" space="xs">
        <Text bold>{title}</Text>
        <Text className="text-muted">{note}</Text>
      </VStack>
      <Text className={amountStyle({ type })}>{formatMoney(amount)}</Text>
    </Pressable>
  );
}
