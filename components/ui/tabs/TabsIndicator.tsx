import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import { tabsAnimationConfig } from "./animation-config";
import { useTabsContext } from "./Context";
import { tabsIndicatorStyle } from "./styles";

type TabsIndicatorProps = {
  scrollOffset?: number;
  animatedScrollOffset?: SharedValue<number>;
  className?: string;
  style?: any;
};

const TabsIndicator = React.forwardRef<any, TabsIndicatorProps>(
  ({ scrollOffset = 0, animatedScrollOffset, className, style }, ref) => {
    const { selectedValue, orientation, triggerLayouts } =
      useTabsContext("TabsIndicator");

    const animatedX = useSharedValue(0);
    const animatedY = useSharedValue(0);
    const animatedWidth = useSharedValue(0);
    const animatedHeight = useSharedValue(0);
    const [hasLayout, setHasLayout] = useState(false);
    // Create a shared value for scroll offset to use in worklet
    const scrollOffsetShared = useSharedValue(scrollOffset);

    // Update scroll offset shared value when scrollOffset changes
    useEffect(() => {
      if (!animatedScrollOffset) {
        scrollOffsetShared.value = scrollOffset;
      }
    }, [scrollOffset, scrollOffsetShared, animatedScrollOffset]);

    useEffect(() => {
      if (selectedValue && triggerLayouts.has(selectedValue)) {
        const layout = triggerLayouts.get(selectedValue);

        if (layout && layout.width > 0) {
          // Determine if this is the first time we're setting values
          const isFirstRender = !hasLayout;
          const duration = isFirstRender
            ? 0
            : tabsAnimationConfig.indicatorDuration;

          // Store the absolute x position (not adjusted for scroll)
          animatedX.value = withDelay(
            20,
            withTiming(layout.x, {
              duration: duration,
              easing: Easing.ease,
            }),
          );
          animatedY.value = withTiming(layout.y, {
            duration: duration,
            easing: Easing.ease,
          });
          animatedWidth.value = withTiming(layout.width, {
            duration: duration,
            easing: Easing.ease,
          });
          animatedHeight.value = withTiming(layout.height, {
            duration: duration,
            easing: Easing.ease,
          });

          if (!hasLayout) {
            setHasLayout(true);
          }
        }
      }
    }, [
      selectedValue,
      triggerLayouts,
      hasLayout,
      animatedX,
      animatedY,
      animatedWidth,
      animatedHeight,
    ]);

    const animatedStyle = useAnimatedStyle(() => {
      "worklet";

      const scrollOffsetValue = animatedScrollOffset
        ? animatedScrollOffset.value
        : scrollOffsetShared.value;

      const xPos =
        orientation === "horizontal"
          ? animatedX.value - scrollOffsetValue
          : animatedX.value;

      // Web: react-native-reanimated does not reliably flush the transform
      // array to a CSS transform string, so use left/top instead.
      // Native: keep transform for GPU-accelerated UI-thread animation.

      return {
        transform: [
          { translateX: xPos } as { translateX: number },
          { translateY: animatedY.value } as { translateY: number },
        ],
        width: animatedWidth.value,
        height: animatedHeight.value,
      };
    }, [orientation, animatedX, animatedY, animatedWidth, animatedHeight]);

    // Don't render indicator until we have valid layout data
    if (!hasLayout) {
      return null;
    }

    return (
      <Animated.View
        ref={ref}
        className={tabsIndicatorStyle({ class: className })}
        style={[
          animatedStyle,
          style,
          {
            position: "absolute",
            zIndex: 1,
          },
        ]}
      />
    );
  },
);

TabsIndicator.displayName = "TabsIndicator";
export { TabsIndicator };
