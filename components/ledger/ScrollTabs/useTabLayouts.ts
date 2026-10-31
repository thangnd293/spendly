import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export type TabLayout = { x: number; width: number };

/** Measures the tabs and computes the scroll offset that centers the selected one. */
export function useTabLayouts(selectedKey: string) {
  const [layouts, setLayouts] = useState<Record<string, TabLayout>>({});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const selected = layouts[selectedKey];

  let targetScroll: number | null = null;
  if (selected && viewportWidth > 0 && contentWidth > 0) {
    const maxScroll = Math.max(0, contentWidth - viewportWidth);
    const centered = selected.x + selected.width / 2 - viewportWidth / 2;
    targetScroll = Math.min(Math.max(centered, 0), maxScroll);
  }

  const registerTab = useCallback((key: string, layout: TabLayout) => {
    setLayouts((previous) => {
      const current = previous[key];
      if (current && current.x === layout.x && current.width === layout.width) return previous;
      return { ...previous, [key]: layout };
    });
  }, []);

  const onViewportLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  }, []);

  const onContentLayout = useCallback((event: LayoutChangeEvent) => {
    setContentWidth(event.nativeEvent.layout.width);
  }, []);

  return { selected, targetScroll, registerTab, onViewportLayout, onContentLayout };
}
