import { CircleDollarSign, TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';

import { FormRowLeading } from '@/components/transaction-form';
import { Center, Divider, HStack, Text, VStack } from '@/components/ui';
import { TransactionBalanceSummary } from '@/data/transaction';
import useColors from '@/hooks/useColors';
import { formatMoney } from '@/utils/money';

type LedgerBalanceSummaryProps = {
  summary: TransactionBalanceSummary;
};

export function LedgerBalanceSummary({ summary }: LedgerBalanceSummaryProps) {
  const colors = useColors();
  const isBalanceIncreased = summary.changeVnd >= 0;

  return (
    <>
      <HStack className="mt-4 items-center" space="md">
        <FormRowLeading>
          <Center className="rounded-full bg-positiveSurface p-3.5">
            <Wallet color={colors.positive} />
          </Center>
        </FormRowLeading>
        <VStack className="flex-1">
          <Text className="font-semibold text-muted" size="sm">
            Số dư đầu
          </Text>
          <Text size="lg" bold>
            {formatMoney(summary.openingBalanceVnd)} ₫
          </Text>
        </VStack>
      </HStack>

      <Divider />

      <HStack className="items-center" space="md">
        <FormRowLeading>
          <Center className="rounded-full bg-positiveSurface p-3.5">
            <CircleDollarSign color={colors.positive} />
          </Center>
        </FormRowLeading>
        <VStack className="flex-1">
          <Text className="font-semibold text-muted" size="sm">
            Số dư cuối
          </Text>
          <Text size="lg" bold>
            {formatMoney(summary.closingBalanceVnd)} ₫
          </Text>
        </VStack>
        <HStack
          className={`rounded-full px-3 py-2 ${isBalanceIncreased ? 'bg-positiveSurface' : 'bg-negativeSurface'}`}
          space="sm"
        >
          {isBalanceIncreased ? (
            <TrendingUp color={colors.positive} size={14} />
          ) : (
            <TrendingDown color={colors.negative} size={14} />
          )}
          <Text
            className={isBalanceIncreased ? 'text-positive' : 'text-negative'}
            size="xs"
            bold
          >
            {formatMoney(Math.abs(summary.changeVnd))} ₫
          </Text>
        </HStack>
      </HStack>
    </>
  );
}
