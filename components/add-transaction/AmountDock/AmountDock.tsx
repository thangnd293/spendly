import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Center, HStack, Text } from '@/components/ui';
import {
  ANIMATION_DURATION_MS,
  CalcKey,
  DELETE_KEY,
  KEY_MARGIN,
  KEYPAD_BOTTOM_ROW,
  KEYPAD_ROWS,
  MIN_BOTTOM_INSET,
  OP_KEYS,
} from './calculator';

function keyHaptic() {
  Haptics.selectionAsync().catch(() => {});
}

function doneHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

type AmountDockProps = {
  keypadVisible: boolean;
  canSave: boolean;
  hasExpression: boolean;
  saveLabel?: string;
  onSave: () => void;
  onKey: (key: CalcKey) => void;
  onDone: () => void;
  onEquals: () => void;
  onInsetChange?: (inset: number) => void;
};

export function AmountDock({
  keypadVisible,
  canSave,
  hasExpression,
  saveLabel = 'Lưu',
  onSave,
  onKey,
  onDone,
  onEquals,
  onInsetChange,
}: AmountDockProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [padWidth, setPadWidth] = useState(screenWidth);
  const keyColumnWidth = (padWidth - KEY_MARGIN * 2) / 4;
  const keyHeight = (keyColumnWidth - KEY_MARGIN * 4) / 2;
  const [chromeHeight, setChromeHeight] = useState(0);
  const [padHeight, setPadHeight] = useState(0);
  const progress = useSharedValue(keypadVisible ? 1 : 0);
  const padHeightSV = useSharedValue(0);
  const onInsetChangeRef = useRef(onInsetChange);
  onInsetChangeRef.current = onInsetChange;

  useEffect(() => {
    progress.value = withTiming(keypadVisible ? 1 : 0, {
      duration: ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [keypadVisible, progress]);

  const bottomPad = Math.max(insets.bottom, MIN_BOTTOM_INSET);
  const inset = chromeHeight + bottomPad + (keypadVisible ? padHeight : 0);

  useEffect(() => {
    if (chromeHeight > 0) onInsetChangeRef.current?.(inset);
  }, [chromeHeight, inset]);

  const dockStyle = useAnimatedStyle(() => ({
    opacity: padHeightSV.value > 0 ? 1 : 0,
    transform: [{ translateY: (1 - progress.value) * padHeightSV.value }],
  }));

  const padStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const onChromeLayout = (event: LayoutChangeEvent) => {
    setChromeHeight(event.nativeEvent.layout.height);
  };

  const onPadLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    padHeightSV.value = height;
    setPadWidth(width);
    setPadHeight(height);
  };

  const doneButtonHeight = keyHeight * 2 + KEY_MARGIN * 2;

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 z-10 bg-surface"
      style={[{ paddingBottom: bottomPad }, dockStyle]}
    >
      <View className="px-2 pb-1 pt-2" onLayout={onChromeLayout}>
        <Pressable
          className="flex-1 items-center justify-center rounded-full bg-primary py-2"
          disabled={!canSave}
          onPress={onSave}
        >
          <Text className="text-white" size="lg">
            {saveLabel}
          </Text>
        </Pressable>
      </View>

      <Animated.View
        className="px-1"
        style={padStyle}
        pointerEvents={keypadVisible ? 'auto' : 'none'}
        onLayout={onPadLayout}
      >
        {KEYPAD_ROWS.map((row) => (
          <HStack key={row.join()}>
            {row.map((key) => (
              <CalcKeyButton
                key={key}
                label={key}
                minHeight={keyHeight}
                onPress={() => onKey(key)}
              />
            ))}
          </HStack>
        ))}

        <HStack>
          {KEYPAD_BOTTOM_ROW.map((column) => (
            <View key={column.join()} className="flex-1">
              {column.map((key) => (
                <CalcKeyButton
                  key={key}
                  label={key}
                  minHeight={keyHeight}
                  onPress={() => onKey(key)}
                />
              ))}
            </View>
          ))}

          <Center className="flex-1">
            <Pressable
              className="items-center justify-center rounded-2xl bg-primary"
              style={{
                margin: KEY_MARGIN,
                width: doneButtonHeight,
                height: doneButtonHeight,
              }}
              onPressIn={doneHaptic}
              onPress={hasExpression ? onEquals : onDone}
              accessibilityLabel={hasExpression ? 'Bằng' : 'Xong'}
            >
              {hasExpression ? (
                <Text className="text-3xl text-white" maxFontSizeMultiplier={1.3}>
                  =
                </Text>
              ) : (
                <Text className="text-lg text-white" bold maxFontSizeMultiplier={1.3}>
                  XONG
                </Text>
              )}
            </Pressable>
          </Center>
        </HStack>
      </Animated.View>
    </Animated.View>
  );
}

type CalcKeyButtonProps = {
  label: CalcKey;
  minHeight: number;
  onPress: () => void;
};

function CalcKeyButton({ label, minHeight, onPress }: CalcKeyButtonProps) {
  const isOperator = OP_KEYS.has(label);

  return (
    <Pressable
      className="flex-1 items-center justify-center rounded-xl bg-surfaceSecondary"
      style={{ margin: KEY_MARGIN, minHeight }}
      onPressIn={keyHaptic}
      onPress={onPress}
      accessibilityLabel={label === DELETE_KEY ? 'Xóa' : label}
    >
      <Text
        className={`${isOperator ? 'text-3xl text-primary' : 'text-2xl text-foreground'}`}
        maxFontSizeMultiplier={1.3}
      >
        {label}
      </Text>
    </Pressable>
  );
}
