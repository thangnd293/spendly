import React from "react";
import { Text } from "react-native";
import { useTriggerContext } from "./Context";
import { tabsTriggerTextStyle } from "./styles";

type TabsTriggerTextProps = React.ComponentPropsWithoutRef<typeof Text>;

const TabsTriggerText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  TabsTriggerTextProps
>(({ className, ...props }, ref) => {
  const { selected, hovered } = useTriggerContext("TabsTriggerText");

  return (
    <Text
      ref={ref}
      className={tabsTriggerTextStyle({ class: className })}
      {...({
        dataSet: { selected, hover: hovered },
      } as any)}
      {...props}
    />
  );
});

TabsTriggerText.displayName = "TabsTriggerText";
export { TabsTriggerText };
