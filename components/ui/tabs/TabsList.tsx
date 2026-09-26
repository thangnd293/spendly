import React from "react";
import { View } from "react-native";
import { useTabsContext } from "./Context";
import { tabsListStyle } from "./styles";

type TabsListProps = React.ComponentPropsWithoutRef<typeof View>;
const TabsList = React.forwardRef<
  React.ComponentRef<typeof View>,
  TabsListProps
>(({ className, ...props }, ref) => {
  const { orientation } = useTabsContext("TabsList");

  return (
    <View
      ref={ref}
      accessibilityRole="tablist"
      className={tabsListStyle({ orientation, class: className })}
      {...props}
    />
  );
});

TabsList.displayName = "TabsList";
export { TabsList };
