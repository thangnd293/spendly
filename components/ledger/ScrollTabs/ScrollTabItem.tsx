import { memo } from 'react';
import { Platform, Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import useColors from '@/hooks/useColors';
import { scrollTabItemStyle, scrollTabTextStyle } from './styles';
import { TabLayout } from './useTabLayouts';

export type ScrollTab = {
  key: string;
  label: string;
};

type ScrollTabItemProps = {
  tab: ScrollTab;
  selected: boolean;
  width?: number;
  indicatorX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
  onPress: (key: string) => void;
  onMeasure: (key: string, layout: TabLayout) => void;
};

export const ScrollTabItem = memo(function ScrollTabItem({
  tab,
  selected,
  width,
  indicatorX,
  indicatorWidth,
  onPress,
  onMeasure,
}: ScrollTabItemProps) {
  const colors = useColors();
  const itemX = useSharedValue(0);
  const itemWidth = useSharedValue(0);
  const platformFontClass = Platform.OS === 'android' ? 'font-roboto-600' : 'font-system';
  const fontStyle =
    Platform.OS === 'ios'
      ? { fontWeight: '600' as const }
      : Platform.OS === 'android'
        ? { fontWeight: 'normal' as const }
        : {};

  const textStyle = useAnimatedStyle(() => {
    if (itemWidth.value === 0 || indicatorWidth.value === 0) {
      return { color: colors.foreground };
    }

    const itemLeft = itemX.value;
    const itemRight = itemX.value + itemWidth.value;
    const pillLeft = indicatorX.value;
    const pillRight = indicatorX.value + indicatorWidth.value;
    const overlap = Math.max(0, Math.min(itemRight, pillRight) - Math.max(itemLeft, pillLeft));
    const coverage = overlap / Math.min(itemWidth.value, indicatorWidth.value);

    return {
      color: interpolateColor(coverage, [0, 1], [colors.foreground, 'white']),
    };
  });
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      className={scrollTabItemStyle()}
      style={width ? { width } : undefined}
      onPress={() => onPress(tab.key)}
      onLayout={(event) => {
        const { x, width: measured } = event.nativeEvent.layout;
        itemX.value = x;
        itemWidth.value = measured;
        onMeasure(tab.key, { x, width: measured });
      }}
    >
      <Animated.Text
        numberOfLines={1}
        className={`${scrollTabTextStyle()} ${platformFontClass}`}
        style={[fontStyle, textStyle]}
      >
        {tab.label}
      </Animated.Text>
    </Pressable>
  );
});
