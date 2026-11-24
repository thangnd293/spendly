import { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { HStack } from '../HStack';
import { Text } from '../Text';

type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: number;
};

function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  size = 28,
}: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internal;

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const checkStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isChecked ? 1 : 0),
    transform: [{ scale: withSpring(isChecked ? 1 : 0.5) }],
  }));

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: isChecked, disabled }}
      className={disabled ? 'opacity-50' : ''}
    >
      <HStack className="items-center" space="md">
        <Animated.View
          style={{ width: size, height: size }}
          className={`items-center justify-center rounded-lg border-2 ${
            isChecked ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
          }`}
        >
          <Animated.View style={checkStyle}>
            <Check size={size * 0.64} color="white" strokeWidth={3.5} />
          </Animated.View>
        </Animated.View>

        {label ? <Text size="lg">{label}</Text> : null}
      </HStack>
    </Pressable>
  );
}

export { Checkbox };
