import { ReactNode, useRef } from 'react';
import { Pressable } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Text } from '../Text';

const ACTION_WIDTH = 80;

type Props = {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
};

function DeleteAction({
  translation,
  onPress,
}: {
  translation: SharedValue<number>;
  onPress: () => void;
}) {
  // translation âm khi vuốt trái -> nút trượt vào cùng với hàng
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translation.value + ACTION_WIDTH }],
  }));

  return (
    <Animated.View style={[{ width: ACTION_WIDTH }, style]}>
      <Pressable
        className="flex-1 items-center justify-center bg-red-500"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Xóa"
      >
        <Text className="text-white" bold>
          Xóa
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function SwipeToDelete({ children, onDelete, disabled }: Props) {
  const ref = useRef<SwipeableMethods>(null);

  return (
    <ReanimatedSwipeable
      ref={ref}
      enabled={!disabled}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={(_progress, translation) => (
        <DeleteAction
          translation={translation}
          onPress={() => {
            ref.current?.close();
            onDelete();
          }}
        />
      )}
    >
      {children}
    </ReanimatedSwipeable>
  );
}
