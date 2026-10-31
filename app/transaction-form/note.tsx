import { router } from 'expo-router';
import { TextInput, View } from 'react-native';

import { useDraftTransaction } from '@/components/transaction-form';
import { Text } from '@/components/ui';

export default function NoteScreen() {
  const { note, setNote } = useDraftTransaction();

  return (
    <View className="flex-1 bg-surface px-4 py-3">
      <TextInput
        className="h-44 text-base"
        multiline
        placeholder="Nhập ghi chú"
        textAlignVertical="top"
        autoFocus
        maxLength={300}
        value={note}
        onChangeText={setNote}
        returnKeyType="done"
        submitBehavior="blurAndSubmit"
        onSubmitEditing={() => router.back()}
      />
      <Text className="self-end text-muted" size="sm">
        {note.length}/300
      </Text>
    </View>
  );
}
