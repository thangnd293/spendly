import { useEffect, useState } from 'react';
import { TextInput, Pressable } from 'react-native';
import { HStack } from '../HStack';
import { Text } from '../Text';

type NumberInputProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function NumberInput({
  value,
  defaultValue = 1,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
}: NumberInputProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(clamp(defaultValue, min, max));
  const current = isControlled ? value : internal;

  const [text, setText] = useState(String(current));

  useEffect(() => {
    setText(String(current));
  }, [current]);

  const commit = (next: number) => {
    const clamped = clamp(next, min, max);
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
    setText(String(clamped));
  };

  const handleChangeText = (t: string) => {
    setText(t.replace(/[^0-9]/g, ''));
  };

  const handleEndEditing = () => {
    const parsed = parseInt(text, 10);
    commit(Number.isNaN(parsed) ? min : parsed);
  };

  const canDecrease = !disabled && current - step >= min;
  const canIncrease = !disabled && current + step <= max;

  return (
    <HStack
      className={`overflow-hidden rounded-2xl border-2 border-background ${disabled ? 'opacity-50' : ''}`}
    >
      <Pressable
        className="size-10 items-center justify-center bg-background"
        onPress={() => commit(current - step)}
        disabled={!canDecrease}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Giảm"
        accessibilityState={{ disabled: !canDecrease }}
      >
        <Text className={canDecrease ? 'text-muted' : 'text-muted/40'} size="2xl">
          -
        </Text>
      </Pressable>

      <TextInput
        className="w-12 text-center"
        value={text}
        onChangeText={handleChangeText}
        onEndEditing={handleEndEditing}
        onSubmitEditing={handleEndEditing}
        keyboardType="number-pad"
        editable={!disabled}
        selectTextOnFocus
        maxLength={String(max).length}
        accessibilityLabel="Số lượng"
      />

      <Pressable
        className="size-10 items-center justify-center bg-background"
        onPress={() => commit(current + step)}
        disabled={!canIncrease}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Tăng"
        accessibilityState={{ disabled: !canIncrease }}
      >
        <Text className={canIncrease ? 'text-muted' : 'text-muted/40'} size="2xl">
          +
        </Text>
      </Pressable>
    </HStack>
  );
}
