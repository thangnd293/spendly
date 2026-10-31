import { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

import { scrollTabsTiming } from './animationConfig';
import { TabLayout } from './useTabLayouts';

export function useDrivenIndicator(selected: TabLayout | undefined, targetScroll: number | null) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const scrollDriver = useSharedValue(0);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const positioned = useRef(false);
  useAnimatedReaction(
    () => scrollDriver.value,
    (x, previous) => {
      if (previous == null || x !== previous) {
        scrollTo(scrollRef, x, 0, false);
      }
    },
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      cancelAnimation(scrollDriver);
    },
  });

  useEffect(() => {
    if (!selected || targetScroll === null) return;

    if (!positioned.current) {
      positioned.current = true;
      indicatorX.value = selected.x;
      indicatorWidth.value = selected.width;
      scheduleOnUI(
        (target: number) => {
          'worklet';
          scrollDriver.value = target;
          scrollTo(scrollRef, target, 0, false);
        },
        targetScroll,
      );
      return;
    }

    // Start from wherever the user left the strip after a manual drag.
    scrollDriver.value = scrollX.value;
    scrollDriver.value = withTiming(targetScroll, scrollTabsTiming);
    indicatorX.value = withTiming(selected.x, scrollTabsTiming);
    indicatorWidth.value = withTiming(selected.width, scrollTabsTiming);
  }, [
    selected,
    targetScroll,
    scrollDriver,
    scrollX,
    indicatorX,
    indicatorWidth,
  ]);

  return {
    scrollRef,
    onScroll,
    indicatorX,
    indicatorWidth,
  };
}
