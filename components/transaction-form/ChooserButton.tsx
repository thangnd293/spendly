import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Divider, HStack, Text, VStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { FormRowLeading } from './FormRowLeading';

type ChooserButtonProps = {
  title?: string;
  placeholder?: string;
  size?: 'md' | 'lg';
  decorLeft: React.ReactNode;
  onPress: () => void;
};

function ChooserButton({ title, onPress, placeholder, size = 'md', decorLeft }: ChooserButtonProps) {
  const colors = useColors();
  const hasTitle = Boolean(title);
  const spacing = size === 'md' ? 'md' : 'xl';
  const paddingTop = size === 'md' ? 'pt-3' : 'pt-5';

  return (
    <Pressable accessibilityRole="button" className="active:bg-black/10" onPress={onPress}>
      <HStack>
        <FormRowLeading>{decorLeft}</FormRowLeading>
        <VStack space={spacing} className="flex-1">
          <HStack className={`items-center justify-between ${paddingTop}`}>
            <Text size="2xl" className={hasTitle ? undefined : 'text-muted'}>
              {title || placeholder}
            </Text>
            <View className="pr-4">
              <ChevronRight color={colors.muted} />
            </View>
          </HStack>
          <Divider />
        </VStack>
      </HStack>
    </Pressable>
  );
}

export { ChooserButton };
