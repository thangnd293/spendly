import React from "react";
import { View } from "react-native";
import { TabsContext } from "./Context";
import { tabsStyle } from "./styles";

type TabsProps = Omit<
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

const Tabs = React.forwardRef<React.ComponentRef<typeof View>, TabsProps>(
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
    const [contentLayouts, setContentLayouts] = React.useState<
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
        contentLayouts,
        registerContent: (
          contentValue: string,
          layout: { x: number; y: number; width: number; height: number },
        ) => {
          setContentLayouts((previous) => {
            const next = new Map(previous);
            next.set(contentValue, layout);
            return next;
          });
        },
      }),
      [
        selectedValue,
        setSelectedValue,
        orientation,
        disabled,
        triggerLayouts,
        contentLayouts,
      ],
    );

    return (
      <TabsContext.Provider value={context}>
        <View ref={ref} className={tabsStyle({ class: className })} {...props}>
          {children}
        </View>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";
export { Tabs };
