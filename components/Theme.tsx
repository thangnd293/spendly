import { useColorScheme } from "@/hooks/useColorScheme";
import { vars } from "nativewind";
import React from "react";
import { View } from "react-native";

import colors from "@/constants/colors";

function toCssVariables(palette: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(palette).map(([name, value]) => [`--color-${name}`, value]),
  ) as Record<string, string>;
}

export default function Theme({ children }: React.PropsWithChildren) {
  const colorScheme = useColorScheme();
  const palette = colors[colorScheme];

  return (
    <View
      className="flex-1 bg-background"
      style={vars(toCssVariables(palette))}
    >
      {children}
    </View>
  );
}
