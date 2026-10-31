import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { scrollTabIndicatorStyle } from './styles';

type ScrollTabIndicatorProps = {
  x: SharedValue<number>;
  width: SharedValue<number>;
  className?: string;
};

export default function ScrollTabIndicator({ x, width, className }: ScrollTabIndicatorProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View
      className={scrollTabIndicatorStyle({ class: className })}
      style={animatedStyle}
    />
  );
}
