import { HStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm theo tên...',
}: SearchBarProps) {
  const colors = useColors();

  return (
    <View className="mx-4 rounded-3xl bg-surface p-3">
      <HStack className="h-12 items-center rounded-2xl bg-surfaceSecondary px-4" space="md">
        <Search size={22} color={colors.muted} />
        <TextInput
          className="flex-1 text-base text-foreground"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Tìm người nhận"
        />
      </HStack>
    </View>
  );
}
