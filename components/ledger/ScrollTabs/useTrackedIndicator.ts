import { useCallback, useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';

import { scrollTabsTiming } from './animationConfig';
import { TabLayout } from './useTabLayouts';

const ARRIVE_EPSILON = 1;
const TRACK_TIMEOUT_MS = 500;

type IndicatorTrack = {
  scrollFrom: number;
  scrollTo: number;
  xFrom: number;
  xTo: number;
  widthFrom: number;
  widthTo: number;
};

export function useTrackedIndicator(selected: TabLayout | undefined, targetScroll: number | null) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const track = useSharedValue<IndicatorTrack | null>(null);
  const positioned = useRef(false);
  const finishTrack = useCallback(() => {
    'worklet';
    const current = track.value;
    if (!current) return;
    track.value = null;
    indicatorX.value = withTiming(current.xTo, scrollTabsTiming);
    indicatorWidth.value = withTiming(current.widthTo, scrollTabsTiming);
  }, [track, indicatorX, indicatorWidth]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const x = event.contentOffset.x;
      scrollX.value = x;

      const current = track.value;
      if (!current) return;

      const arrived = Math.abs(current.scrollTo - x) < ARRIVE_EPSILON;
      const raw = (x - current.scrollFrom) / (current.scrollTo - current.scrollFrom);
      const progress = arrived ? 1 : Math.min(Math.max(raw, 0), 1);

      indicatorX.value = current.xFrom + (current.xTo - current.xFrom) * progress;
      indicatorWidth.value = current.widthFrom + (current.widthTo - current.widthFrom) * progress;
      if (arrived) track.value = null;
    },
    onBeginDrag: () => {
      finishTrack();
    },
  });

  useEffect(() => {
    if (!selected || targetScroll === null) return;

    const isFirst = !positioned.current;
    positioned.current = true;

    scheduleOnUI(
      (targetScroll: number, tabX: number, tabWidth: number, jump: boolean) => {
        'worklet';
        cancelAnimation(indicatorX);
        cancelAnimation(indicatorWidth);

        if (jump) {
          track.value = null;
          indicatorX.value = tabX;
          indicatorWidth.value = tabWidth;
          scrollTo(scrollRef, targetScroll, 0, false);
          return;
        }

        if (Math.abs(targetScroll - scrollX.value) < ARRIVE_EPSILON) {
          track.value = null;
          indicatorX.value = withTiming(tabX, scrollTabsTiming);
          indicatorWidth.value = withTiming(tabWidth, scrollTabsTiming);
          return;
        }

        track.value = {
          scrollFrom: scrollX.value,
          scrollTo: targetScroll,
          xFrom: indicatorX.value,
          xTo: tabX,
          widthFrom: indicatorWidth.value,
          widthTo: tabWidth,
        };

        scrollTo(scrollRef, targetScroll, 0, true);
      },
      targetScroll,
      selected.x,
      selected.width,
      isFirst,
    );

    if (isFirst) return;
    const timeout = setTimeout(() => scheduleOnUI(finishTrack), TRACK_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [selected, targetScroll, scrollRef, scrollX, indicatorX, indicatorWidth, track, finishTrack]);

  return { scrollRef, onScroll, indicatorX, indicatorWidth };
}
