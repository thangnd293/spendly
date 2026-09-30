import { HStack, Text } from '@/components/ui';
import { Pressable, View } from 'react-native';
import { StepButton } from './StepButton';

type MonthPickerProps = {
  year: number;
  pickedDate: Date;
  onYearChange: (year: number) => void;
  onPickMonth: (month: number) => void;
  onPressYear: () => void;
};

function MonthPicker({
  year,
  pickedDate,
  onYearChange,
  onPickMonth,
  onPressYear,
}: MonthPickerProps) {
  function isPickedMonth(month: number) {
    return month === pickedDate.getMonth() && year === pickedDate.getFullYear();
  }

  return (
    <View className="px-3 pb-3">
      <HStack className="mb-3 items-center justify-between">
        <StepButton
          direction="left"
          onPress={() => onYearChange(year - 1)}
          accessibilityLabel="Năm trước"
          iconSize={16}
          className="bg-surface shadow-sm"
        />
        <Pressable onPress={onPressYear} accessibilityRole="button" accessibilityLabel="Chọn ngày">
          <Text className="text-primary">{year}</Text>
        </Pressable>
        <StepButton
          direction="right"
          onPress={() => onYearChange(year + 1)}
          accessibilityLabel="Năm sau"
          iconSize={16}
          className="bg-surface shadow-sm"
        />
      </HStack>
      <View className="flex-row flex-wrap">
        {Array.from({ length: 12 }, (_, month) => (
          <Pressable
            key={month}
            onPress={() => onPickMonth(month)}
            className="w-1/3 p-1"
            accessibilityRole="button"
            accessibilityLabel={`Tháng ${month + 1}, năm ${year}`}
          >
            <View
              className={`h-11 items-center justify-center rounded-lg ${isPickedMonth(month) ? 'bg-primary' : 'bg-surfaceSecondary'}`}
            >
              <Text size="sm" className={isPickedMonth(month) ? 'text-white' : 'text-foreground'}>
                Tháng {month + 1}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export { MonthPicker };
