import { Platform } from 'react-native';

import { useDrivenIndicator } from './useDrivenIndicator';
import { useTabLayouts } from './useTabLayouts';
import { useTrackedIndicator } from './useTrackedIndicator';

// Chosen once per platform, so the hook order is stable across renders.
const useIndicatorSync = Platform.OS == 'android' ? useTrackedIndicator : useDrivenIndicator;

export function useCenteredTabs(selectedKey: string) {
  const { selected, targetScroll, registerTab, onViewportLayout, onContentLayout } =
    useTabLayouts(selectedKey);

  const {
    scrollRef,
    onScroll,
    indicatorX,
    indicatorWidth,
  } = useIndicatorSync(
    selected,
    targetScroll,
  );

  return {
    scrollRef,
    onScroll,
    onViewportLayout,
    onContentLayout,
    registerTab,
    indicatorX,
    indicatorWidth,
    indicatorReady: selected !== undefined,
  };
}
