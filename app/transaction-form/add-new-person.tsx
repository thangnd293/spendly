import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import AvatarUrlInput from '@/components/add-new-person/AvatarUrlInput';
import Hero from '@/components/add-new-person/Hero';
import NameInput from '@/components/add-new-person/NameInput';
import { Text } from '@/components/ui';
import { insertPerson } from '@/data/person';
import { useDbMutation } from '@/hooks/useDbMutation';
import { isValidImageUrl } from '@/utils/common';

export default function AddNewPersonScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const { run: save } = useDbMutation(insertPerson);

  const trimmedName = name.trim();
  const trimmedUrl = avatarUrl.trim();
  const urlOk = trimmedUrl === '' || isValidImageUrl(trimmedUrl);
  const canSubmit = trimmedName.length > 0 && urlOk;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await save({
      name: trimmedName,
      avatarUrl: trimmedUrl || undefined,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Hero />

        <View className="mt-8 px-5">
          <NameInput value={name} onChangeText={setName} />

          <Text size="lg" className="mb-3 mt-8 text-indigo-950">
            <Text size="lg" bold className="text-indigo-950">
              Thông tin bổ sung
            </Text>{' '}
            (tùy chọn)
          </Text>

          <AvatarUrlInput value={avatarUrl} onChangeText={setAvatarUrl} />

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit }}
            className={`mt-8 h-14 items-center justify-center rounded-full bg-green-500 ${
              canSubmit ? 'active:opacity-80' : 'opacity-50'
            }`}
          >
            <Text size="lg" bold className="text-white">
              Thêm người
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            className="mt-4 items-center py-2"
          >
            <Text size="lg" className="text-indigo-300">
              Hủy
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
