import { Center, Divider, HStack, Text } from '@/components/ui';
import { X } from 'lucide-react-native';
import { RefObject } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type AmountFieldProps = {
  value: string;
  inputRef?: RefObject<TextInput | null>;
  autoFocus?: boolean;
  onFocus: () => void;
  onClear: () => void;
};

export function AmountField({ value, autoFocus, inputRef, onFocus, onClear }: AmountFieldProps) {
  return (
    <HStack className="mt-3">
      <Center className="w-20">
        <Pressable className="items-center justify-center rounded-[4px] border border-border px-2 py-1">
          <Text className="text-muted">VND</Text>
        </Pressable>
      </Center>
      <View className="flex-1">
        <HStack space="md" className="items-center justify-between py-5">
          <Text className="absolute -top-1 text-muted" size="sm">
            Số tiền
          </Text>

          <TextInput
            ref={inputRef}
            className="flex-1 p-1 text-3xl font-medium text-foreground"
            style={{ includeFontPadding: false }}
            placeholder="0"
            placeholderTextColor="transparent"
            value={value}
            autoFocus={autoFocus}
            showSoftInputOnFocus={false}
            caretHidden={false}
            contextMenuHidden
            onFocus={onFocus}
          />

          {!!value && (
            <Pressable
              className="absolute right-3 rounded-full bg-black/20 p-0.5"
              onPress={onClear}
            >
              <X size={14} color="white" />
            </Pressable>
          )}
        </HStack>
        <Divider className="bg-border" />
      </View>
    </HStack>
  );
}
