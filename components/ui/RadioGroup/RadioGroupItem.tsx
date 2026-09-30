import React from "react";
import { Pressable } from "react-native";
import { RadioGroupItemContext, useRadioGroupContext } from "./Context";
import { radioGroupItemStyle } from "./styles";

type RadioGroupItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof Pressable>,
  "onPress"
> & {
  value: string;
  onPress?: React.ComponentProps<typeof Pressable>["onPress"];
};
const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  RadioGroupItemProps
>(
  (
    {
      value,
      disabled = false,
      className,
      children,
      onPress,
      onHoverIn,
      onHoverOut,
      onLayout,
      ...props
    },
    ref,
  ) => {
    const {
      selectedValue,
      setSelectedValue,
      disabled: tabsDisabled,
      registerTrigger,
    } = useRadioGroupContext("RadioGroupItem");
    const [hovered, setHovered] = React.useState(false);
    const isDisabled = disabled || tabsDisabled;
    const selected = selectedValue === value;

    return (
      <RadioGroupItemContext.Provider
        value={{ selected, disabled: isDisabled, hovered }}
      >
        <Pressable
          ref={ref}
          accessibilityRole="tab"
          accessibilityState={{ selected, disabled: isDisabled }}
          disabled={isDisabled}
          className={radioGroupItemStyle({ class: className })}
          {...({
            dataSet: { selected, disabled: isDisabled, hover: hovered },
          } as any)}
          onPress={(event) => {
            onPress?.(event);
            if (!isDisabled) setSelectedValue(value);
          }}
          onHoverIn={(event) => {
            setHovered(true);
            onHoverIn?.(event);
          }}
          onHoverOut={(event) => {
            setHovered(false);
            onHoverOut?.(event);
          }}
          onLayout={(event) => {
            onLayout?.(event);
            registerTrigger(value, event.nativeEvent.layout);
          }}
          {...props}
        >
          {children}
        </Pressable>
      </RadioGroupItemContext.Provider>
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";
export { RadioGroupItem };
