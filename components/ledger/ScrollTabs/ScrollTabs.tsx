import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HStack } from '@/components/ui';
import ScrollTabIndicator from './ScrollTabIndicator';
import { ScrollTab, ScrollTabItem } from './ScrollTabItem';
import { scrollTabsStyle } from './styles';
import { useCenteredTabs } from './useCenteredTabs';

type ScrollTabsProps = {
  tabs: ScrollTab[];
  value: string;
  onValueChange: (key: string) => void;
  itemWidth?: number;
  className?: string;
};

export default function ScrollTabs({
  tabs,
  value,
  onValueChange,
  itemWidth,
  className,
}: ScrollTabsProps) {
  const {
    scrollRef,
    onScroll,
    onViewportLayout,
    onContentLayout,
    registerTab,
    indicatorX,
    indicatorWidth,
    indicatorReady,
  } = useCenteredTabs(value);

  return (
    <View className="relative z-10">
      <View accessibilityRole="tablist" className={scrollTabsStyle({ class: className })}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onLayout={onViewportLayout}
        >
          <HStack onLayout={onContentLayout}>
            {indicatorReady ? <ScrollTabIndicator x={indicatorX} width={indicatorWidth} /> : null}

            {tabs.map((tab) => (
              <ScrollTabItem
                key={tab.key}
                tab={tab}
                selected={tab.key === value}
                width={itemWidth}
                indicatorX={indicatorX}
                indicatorWidth={indicatorWidth}
                onPress={onValueChange}
                onMeasure={registerTab}
              />
            ))}
          </HStack>
        </Animated.ScrollView>
      </View>
    </View>
  );
}
