import { Center, HStack, Text, VStack } from '@/components/ui';
import useColors from '@/hooks/useColors';
import { isValidImageUrl } from '@/utils/common';
import { Camera, Link2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, TextInput, View } from 'react-native';

interface AvatarUrlInputProps {
  value: string;
  onChangeText: (t: string) => void;
}
export default function AvatarUrlInput({ value, onChangeText }: AvatarUrlInputProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const url = value.trim();
  const hasValue = url.length > 0;
  const validFormat = hasValue && isValidImageUrl(url);
  const showPreview = validFormat && !loadFailed;

  let error: string | null = null;
  if (hasValue && !validFormat)
    error = 'Link không hợp lệ (cần bắt đầu bằng http:// hoặc https://)';
  else if (validFormat && loadFailed) error = 'Không tải được ảnh từ link này';

  const handleChange = (text: string) => {
    setLoadFailed(false); // đổi link thì thử tải lại
    onChangeText(text);
  };

  return (
    <View>
      <View
        className={`rounded-3xl border bg-surface p-4 ${
          error ? 'border-negative' : focused ? 'border-primary' : 'border-border'
        }`}
      >
        <HStack className="items-center" space="md">
          {showPreview ? (
            <Image
              source={{ uri: url }}
              style={{ width: 64, height: 64 }}
              className="rounded-full bg-surfaceSecondary"
              onError={() => setLoadFailed(true)}
            />
          ) : (
            <Center className="size-16 rounded-full bg-surfaceSecondary">
              <Camera size={28} color={colors.muted} />
            </Center>
          )}

          <VStack className="flex-1">
            <Text size="lg">Ảnh đại diện</Text>
            <HStack className="items-center" space="xs">
              <Link2 size={16} color={colors.muted} />
              <TextInput
                className="flex-1 py-1 text-sm text-foreground"
                value={value}
                onChangeText={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Dán link hình ảnh..."
                placeholderTextColor={colors.muted}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                accessibilityLabel="Link ảnh đại diện"
              />
            </HStack>
          </VStack>

          {hasValue ? (
            <Pressable
              onPress={() => handleChange('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Xoá link"
              className="size-8 items-center justify-center rounded-full bg-surfaceSecondary"
            >
              <X size={16} color={colors.muted} />
            </Pressable>
          ) : null}
        </HStack>
      </View>

      {error ? (
        <Text size="sm" className="mt-2 px-2 text-negative">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
