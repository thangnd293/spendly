import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';

import useColors from '@/hooks/useColors';

type StepButtonProps = {
  direction: 'left' | 'right';
  onPress: () => void;
  accessibilityLabel: string;
  iconSize?: number;
  className?: string;
};

function StepButton({
  direction,
  onPress,
  accessibilityLabel,
  iconSize = 24,
  className = 'bg-background',
}: StepButtonProps) {
  const colors = useColors();
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <Pressable
      onPress={onPress}
      className={`size-8 items-center justify-center rounded-full ${className}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon size={iconSize} color={colors.primary} />
    </Pressable>
  );
}

export { StepButton };
