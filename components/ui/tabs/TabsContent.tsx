import React from "react";
import { View } from "react-native";
import { useTabsContext } from "./Context";

type TabsContentProps = React.ComponentPropsWithoutRef<typeof View> & {
  value: string;
  forceMount?: boolean;
};
const TabsContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  TabsContentProps
>(
  (
    { value, forceMount = false, className, children, onLayout, ...props },
    ref,
  ) => {
    const { selectedValue, registerContent } = useTabsContext("TabsContent");
    const selected = selectedValue === value;

    if (!selected && !forceMount) return null;

    return (
      <View
        ref={ref}
        className={className}
        onLayout={(event) => {
          onLayout?.(event);
          registerContent(value, event.nativeEvent.layout);
        }}
        {...props}
      >
        {children}
      </View>
    );
  },
);

TabsContent.displayName = "TabsContent";
export { TabsContent };
