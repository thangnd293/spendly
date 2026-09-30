import React from "react";
import { View } from "react-native";

import { vstackStyle } from "./styles";
import { VariantProps } from "tailwind-variants";

type VStackProps = React.ComponentProps<typeof View> &
  VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<React.ComponentRef<typeof View>, VStackProps>(
  function VStack({ className, space, reversed, ...props }, ref) {
    return (
      <View
        className={vstackStyle({
          space,
          reversed: reversed as boolean,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  },
);

VStack.displayName = "VStack";

export { VStack };
