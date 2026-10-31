import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { tv, VariantProps } from 'tailwind-variants';

import useColors from '@/hooks/useColors';

const selectionOptionStyle = tv({
  base: 'relative flex-row items-center gap-3 bg-surface active:bg-black/10',
  variants: {
    layout: {
      card: 'rounded-3xl px-4 py-3',
      branch: 'py-3.5 pl-8 pr-6',
    },
  },
  defaultVariants: {
    layout: 'card',
  },
});

type SelectionOptionProps = {
  leading: React.ReactNode;
  children: React.ReactNode;
  decoration?: React.ReactNode;
  selected?: boolean;
  className?: string;
  onPress: () => void;
} & VariantProps<typeof selectionOptionStyle>;

function SelectionOption({
  leading,
  className,
  children,
  selected,
  layout,
  decoration,
  onPress,
}: SelectionOptionProps) {
  const colors = useColors();

  return (
    <Pressable
      className={selectionOptionStyle({ layout, class: className })}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {decoration && (
        <View pointerEvents="none" className="absolute inset-0">
          {decoration}
        </View>
      )}
      {leading}
      <View className="flex-1">{children}</View>
      {selected && <Check color={colors.primary} />}
    </Pressable>
  );
}

export { SelectionOption };
