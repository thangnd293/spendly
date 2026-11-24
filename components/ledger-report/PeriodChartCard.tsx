import type { ComponentProps } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { HStack, Text, VStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import PeriodBarChart from './PeriodBarChart';

type Props = {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
} & ComponentProps<typeof PeriodBarChart>;

export default function PeriodChartCard({
  title,
  subtitle = 'Theo 6 kỳ gần nhất',
  icon: Icon,
  iconColor,
  ...chartProps
}: Props) {
  const colors = useColors();

  return (
    <VStack className="rounded-xl bg-surface p-4" space="md">
      <HStack className="items-center gap-3">
        <View className="size-8 items-center justify-center">
          <Icon size={22} color={iconColor ?? colors.info} />
        </View>
        <VStack>
          <Text className="font-semibold">{title}</Text>
          <Text className="text-muted" size="sm">
            {subtitle}
          </Text>
        </VStack>
      </HStack>

      <PeriodBarChart {...chartProps} />
    </VStack>
  );
}
