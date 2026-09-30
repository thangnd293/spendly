import React from "react";
import { Text } from "react-native";
import { radioGroupItemTextStyle } from "./styles";
import { useRadioGroupItemContext } from "./Context";

type RadioGroupItemTextProps = React.ComponentPropsWithoutRef<typeof Text>;

const RadioGroupItemText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  RadioGroupItemTextProps
>(({ className, ...props }, ref) => {
  const { selected, hovered } = useRadioGroupItemContext("RadioGroupItemText");

  return (
    <Text
      ref={ref}
      className={radioGroupItemTextStyle({ class: className })}
      {...({
        dataSet: { selected, hover: hovered },
      } as any)}
      {...props}
    />
  );
});

RadioGroupItemText.displayName = "RadioGroupItemText";
export { RadioGroupItemText };
