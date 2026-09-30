import React from "react";
import { View } from "react-native";
import { RadioGroupContext } from "./Context";
import { radioGroupStyle } from "./styles";

type RadioGroupProps = Omit<
  React.ComponentPropsWithoutRef<typeof View>,
  "children"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  children?: React.ReactNode;
};

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof View>,
  RadioGroupProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      string | null
    >(defaultValue ?? null);
    const selectedValue = value !== undefined ? value : uncontrolledValue;
    const [triggerLayouts, setTriggerLayouts] = React.useState<
      Map<string, { x: number; y: number; width: number; height: number }>
    >(new Map());

    const setSelectedValue = React.useCallback(
      (nextValue: string) => {
        if (value === undefined) setUncontrolledValue(nextValue);
        if (nextValue !== selectedValue) onValueChange?.(nextValue);
      },
      [value, selectedValue, onValueChange],
    );

    const context = React.useMemo(
      () => ({
        selectedValue,
        setSelectedValue,
        orientation,
        disabled,
        triggerLayouts,
        registerTrigger: (
          triggerValue: string,
          layout: { x: number; y: number; width: number; height: number },
        ) => {
          setTriggerLayouts((previous) => {
            const next = new Map(previous);
            next.set(triggerValue, layout);
            return next;
          });
        },
      }),
      [selectedValue, setSelectedValue, orientation, disabled, triggerLayouts],
    );

    return (
      <RadioGroupContext.Provider value={context}>
        <View
          ref={ref}
          accessibilityRole="radiogroup"
          className={radioGroupStyle({ orientation, class: className })}
          {...props}
        >
          {children}
        </View>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
export { RadioGroup };
