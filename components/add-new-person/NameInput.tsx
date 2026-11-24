import { HStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { User } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput } from 'react-native';

interface NameInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function NameInput({ value, onChangeText }: NameInputProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <HStack
      className={`h-16 items-center rounded-full border bg-surface px-5 ${
        focused ? 'border-primary' : 'border-border'
      }`}
      space="md"
    >
      <User size={24} color={focused ? colors.primary : colors.muted} />
      <TextInput
        className="flex-1 text-lg text-foreground"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Tên người dùng *"
        placeholderTextColor={colors.muted}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
        maxLength={40}
        accessibilityLabel="Tên người dùng"
      />
    </HStack>
  );
}
