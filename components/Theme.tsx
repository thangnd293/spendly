import { vars } from 'nativewind';
import { PropsWithChildren } from 'react';
import { View } from 'react-native';

import colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function toCssVariables(palette: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(palette).map(([name, value]) => [`--color-${name}`, value]),
  ) as Record<string, string>;
}

export default function Theme({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const palette = colors[colorScheme];

  return (
    <View className="flex-1" style={vars(toCssVariables(palette))}>
      {children}
    </View>
  );
}
