import { router } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { ChevronRight, ChevronsUpDown, Diff, Package, X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDraftTransaction } from '@/components/transaction-form';
import { useAddCategory } from '@/components/transaction-form/AddCategoryContext';
import { FormRowLeading } from '@/components/transaction-form/FormRowLeading';
import { Button, Divider, HStack, Image, RadioGroup, Text, VStack } from '@/components/ui';
import { CategoryKind, getCategoryById, insertCategory } from '@/data/category';
import useColors from '@/hooks/useColors';
import { useDbMutation } from '@/hooks/useDbMutation';
import { useDbQuery } from '@/hooks/useDbQuery';
import { iconName, iconSource } from '@/utils/icons';

export default function AddCategoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const colors = useColors();
  const draftCategory = useAddCategory();
  const draftTransaction = useDraftTransaction();

  const { data: parentCategory } = useDbQuery(
    (db) => getCategoryById(db, draftCategory.parentId),
    [draftCategory.parentId],
    null,
  );
  const { run: save } = useDbMutation(insertCategory);

  const hasParent = Boolean(parentCategory);
  const saveDisabled = !draftCategory.name.trim();

  async function onSaveCategory() {
    await save({
      name: draftCategory.name,
      icon: draftCategory.icon,
      parentId: draftCategory.parentId,
      kind: draftCategory.kind,
    });
    draftTransaction.setKind(draftCategory.kind);
    router.back();
  }

  function onKindChange(value: CategoryKind) {
    draftCategory.setKind(value);
    draftCategory.setParentId(null);
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight + 24}
    >
      <View className="flex-1 justify-between" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="mx-3 my-2 overflow-hidden rounded-3xl bg-surface">
          <View>
            <HStack space="md" className="items-center p-3">
              <Pressable
                className="flex-row items-center gap-1.5 rounded-3xl bg-surfaceSecondary p-1.5"
                onPress={() => router.push('/transaction-form/select-icon')}
              >
                <Image
                  size="xs"
                  source={iconSource(draftCategory.icon)}
                  alt={iconName(draftCategory.icon)}
                />
                <ChevronsUpDown size={16} color={colors.muted} />
              </Pressable>

              <TextInput
                className="flex-1 p-1 text-2xl text-foreground"
                placeholder="Tên nhóm"
                value={draftCategory.name}
                onChangeText={draftCategory.setName}
                accessibilityLabel="Tên nhóm"
                style={{ includeFontPadding: false }}
              />
            </HStack>
            <Divider />
          </View>

          <HStack className="items-center pt-4">
            <FormRowLeading className="pb-4">
              <Diff />
            </FormRowLeading>
            <VStack space="lg" className="flex-1">
              <RadioGroup
                className="self-start"
                value={draftCategory.kind}
                items={[
                  { value: 'spend', label: 'Khoản chi' },
                  { value: 'income', label: 'Khoản thu' },
                ]}
                onValueChange={onKindChange}
              />
              <Divider />
            </VStack>
          </HStack>

          <HStack>
            <Pressable
              className="flex-1 flex-row active:bg-black/10"
              onPress={() => router.push('/transaction-form/select-parent-category')}
              accessibilityRole="button"
            >
              <FormRowLeading>
                <Package />
              </FormRowLeading>

              <HStack className="flex-1 items-center justify-between py-3">
                <VStack>
                  <Text size="sm" className="text-muted">
                    Nhóm cha
                  </Text>
                  <Text size="lg" className={hasParent ? 'text-foreground' : 'text-muted'}>
                    {parentCategory?.name ?? 'Chọn nhóm'}
                  </Text>
                </VStack>

                {!hasParent && (
                  <View className="mr-4">
                    <ChevronRight color={colors.muted} />
                  </View>
                )}
              </HStack>
            </Pressable>

            {hasParent && (
              <Pressable
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1"
                accessibilityRole="button"
                accessibilityLabel="Xóa nhóm cha"
                onPress={() => draftCategory.setParentId(null)}
              >
                <X size={14} color="white" />
              </Pressable>
            )}
          </HStack>
        </View>

        <Button
          variant="primary"
          className="mx-3"
          title="Lưu"
          disabled={saveDisabled}
          onPress={onSaveCategory}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
