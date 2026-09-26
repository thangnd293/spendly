import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTabsContext } from "./Context";
import { tabsContentWrapperStyle } from "./styles";

type TabsContentWrapperProps = React.ComponentPropsWithoutRef<typeof View>;
const TabsContentWrapper = React.forwardRef<
  React.ComponentRef<typeof Animated.View>,
  TabsContentWrapperProps
>(({ className, ...props }, ref) => {
  const { selectedValue, contentLayouts } =
    useTabsContext("TabsContentWrapper");
  const contentHeight = selectedValue
    ? (contentLayouts.get(selectedValue)?.height ?? 0)
    : 0;
  const animatedHeight = useSharedValue(contentHeight);
  const hasInitialHeight = React.useRef(contentHeight > 0);

  React.useEffect(() => {
    if (contentHeight <= 0) return;

    if (!hasInitialHeight.current) {
      animatedHeight.value = contentHeight;
      hasInitialHeight.current = true;
    } else {
      animatedHeight.value = withSpring(contentHeight, { duration: 180 });
    }
  }, [animatedHeight, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value > 0 ? animatedHeight.value : undefined,
  }));

  return (
    <Animated.View
      ref={ref}
      style={animatedStyle}
      className={tabsContentWrapperStyle({ class: className })}
      {...props}
    />
  );
});

TabsContentWrapper.displayName = "TabsContentWrapper";
export { TabsContentWrapper };
