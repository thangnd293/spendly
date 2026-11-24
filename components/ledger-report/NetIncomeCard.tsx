import type { ReactNode } from 'react';
import { View } from 'react-native';
import { ArrowDown, Info } from 'lucide-react-native';

import { Divider, HStack, Text, Tooltip, VStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { formatMoney } from '@/utils/money';

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <VStack className="items-center" space="xs">
      <Text className="font-semibold text-muted" size="sm">
        {label}
      </Text>
      <Text className="font-semibold">{formatMoney(value)} ₫</Text>
    </VStack>
  );
}

type Props = {
  netIncome: number;
  changePercent: number;
  openingBalance: number;
  income: number;
  closingBalance: number;
  children?: ReactNode; // ScrollTabs
};

export default function NetIncomeCard({
  netIncome,
  changePercent,
  openingBalance,
  income,
  closingBalance,
  children,
}: Props) {
  const colors = useColors();

  return (
    <VStack className="rounded-3xl bg-surface p-3" space="lg">
      {children}

      <VStack className="px-2" space="md">
        <VStack>
          <HStack className="items-center" space="xs">
            <Text className="font-semibold">Thu nhập ròng</Text>
            <Tooltip
              text="Thu nhập ròng bằng tổng thu trừ tổng chi trong kỳ"
              placement="top"
              hasArrow
              offset={-56}
            >
              <Info size={20} color={colors.muted} />
            </Tooltip>
          </HStack>
          <Text className="font-medium" size="3xl">
            {netIncome > 0 ? '+' : ''}
            {formatMoney(netIncome)} ₫
          </Text>
        </VStack>

        <Text size="sm">
          <Text className="items-center justify-center font-medium text-positive" size="sm">
            <View className="translate-y-0.5" collapsable>
              <ArrowDown size={14} color={colors.positive} />
            </View>
            {changePercent}%
          </Text>{' '}
          so với kỳ trước
        </Text>

        <Divider className="my-2" />

        <HStack className="justify-around">
          <StatItem label="Số dư đầu" value={openingBalance} />
          <Divider orientation="vertical" />
          <StatItem label="Thu nhập" value={income} />
          <Divider orientation="vertical" />
          <StatItem label="Số dư cuối" value={closingBalance} />
        </HStack>
      </VStack>
    </VStack>
  );
}
