import { ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Center, Text } from '@/components/ui';
import useColors from '@/hooks/useColors';

type LedgerReportButtonProps = {
  onPress: () => void;
};

export function LedgerReportButton({ onPress }: LedgerReportButtonProps) {
  const colors = useColors();

  return (
    <Pressable
      className="flex-row items-center rounded-lg bg-positiveSurface px-3 py-3"
      onPress={onPress}
      style={{
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <Center className="size-5 rounded-full bg-primary">
        <Text className="text-white" size="sm">
          i
        </Text>
      </Center>
      <Text className="ml-3 flex-1 text-primary" size="sm">
        Xem báo cáo cho giai đoạn này
      </Text>
      <ChevronRight size={16} color={colors.primary} strokeWidth={2} />
    </Pressable>
  );
}
