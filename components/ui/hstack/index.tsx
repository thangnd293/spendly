import React from "react";

import { View, ViewProps } from "react-native";
import { VariantProps } from "tailwind-variants";
import { hstackStyle } from "./styles";

type HStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ComponentRef<typeof View>, HStackProps>(
  function HStack({ className, space, reversed, ...props }, ref) {
    return (
      <View
        className={hstackStyle({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

HStack.displayName = "HStack";
export { HStack };
