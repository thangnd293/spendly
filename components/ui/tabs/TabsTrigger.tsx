import React from "react";
import { Pressable } from "react-native";
import { TriggerContext, useTabsContext } from "./Context";
import { tabsTriggerStyle } from "./styles";

type TabsTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof Pressable>,
  "onPress"
> & {
  value: string;
  onPress?: React.ComponentProps<typeof Pressable>["onPress"];
};
const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  TabsTriggerProps
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
    } = useTabsContext("TabsTrigger");
    const [hovered, setHovered] = React.useState(false);
    const isDisabled = disabled || tabsDisabled;
    const selected = selectedValue === value;

    return (
      <TriggerContext.Provider
        value={{ selected, disabled: isDisabled, hovered }}
      >
        <Pressable
          ref={ref}
          accessibilityRole="tab"
          accessibilityState={{ selected, disabled: isDisabled }}
          disabled={isDisabled}
          className={tabsTriggerStyle({ class: className })}
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
      </TriggerContext.Provider>
    );
  },
);

TabsTrigger.displayName = "TabsTrigger";
export { TabsTrigger };
