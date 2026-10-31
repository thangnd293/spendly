import { StatusBar } from 'expo-status-bar';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { NotepadText } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import {
  AmountDock,
  AmountField,
  ChooserButton,
  DatePicker,
  useDraftTransaction,
  useAmountDigits,
} from '@/components/transaction-form';
import { Image, RadioGroup, Text } from '@/components/ui';
import { listActiveAccounts } from '@/data/account';
import { CategoryKind, listCategories } from '@/data/category';
import { getTransactionById, updateTransaction } from '@/data/transaction';
import { useDbMutation } from '@/hooks/useDbMutation';
import { useDbQuery } from '@/hooks/useDbQuery';
import { formatDateForStorage } from '@/utils/date';
import { iconName, iconSource } from '@/utils/icons';

export default function EditTransactionScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: transaction } = useDbQuery(
    (db) => (id ? getTransactionById(db, id) : Promise.resolve(null)),
    [id],
    null,
  );

  const amount = useAmountDigits(transaction ? String(transaction.amountVnd) : '');
  const [dockInset, setDockInset] = useState(0);
  const draft = useDraftTransaction();
  const initializedId = useRef<string | null>(null);

  useEffect(() => {
    if (!transaction) return;
    if (initializedId.current === transaction.id) return;
    initializedId.current = transaction.id;

    draft.setKind(transaction.type);
    draft.setAccount(transaction.accountId);
    draft.setCategory(transaction.categoryId);
    draft.setNote(transaction.note ?? '');

    const [year, month, day] = transaction.occurredOn.slice(0, 10).split('-').map(Number);
    draft.setOccurredOn(new Date(year, month - 1, day));
  }, [transaction]);

  const { data: accounts } = useDbQuery((db) => listActiveAccounts(db), [], []);
  const { data: categories } = useDbQuery((db) => listCategories(db, draft.kind), [draft.kind], []);
  const { run: update, pending } = useDbMutation(updateTransaction);

  if (!id) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-muted">Thiếu mã giao dịch</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-muted">Đang tải giao dịch...</Text>
      </View>
    );
  }

  const selectedAccount = accounts.find((item) => item.id === draft.account);
  const selectedCategory = categories.find((item) => item.id === draft.category);
  const saveDisabled =
    pending || amount.amountVnd <= 0 || !draft.account || !draft.category || !draft.occurredOn;

  function onKindChange(value: CategoryKind) {
    draft.setKind(value);
    draft.setCategory(null);
  }

  async function onSave() {
    if (saveDisabled) return;

    await update({
      id,
      input: {
        type: draft.kind,
        occurredOn: formatDateForStorage(draft.occurredOn),
        amountVnd: amount.amountVnd,
        accountId: draft.account!,
        categoryId: draft.category!,
        note: draft.note,
      },
    });
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Sửa giao dịch' }} />
      <View className="flex-1">
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View className="m-6">
            <View className="rounded-t-3xl bg-surface pt-2">
              <RadioGroup
                className="mx-4"
                itemClassName="w-1/2"
                items={[
                  { value: 'spend', label: 'Khoản chi' },
                  { value: 'income', label: 'Khoản thu' },
                ]}
                value={draft.kind}
                onValueChange={onKindChange}
              />
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: dockInset }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="rounded-b-3xl bg-surface pt-2">
                <ChooserButton
                  title={selectedAccount?.name}
                  placeholder="Chọn ví"
                  decorLeft={
                    <Image
                      size="2xs"
                      source={iconSource(selectedAccount?.icon)}
                      alt={iconName(selectedAccount?.icon)}
                    />
                  }
                  onPress={() => {
                    amount.close();
                    router.push('/transaction-form/account');
                  }}
                />

                <AmountField
                  inputRef={amount.inputRef}
                  value={amount.mode ? amount.formattedExpression : amount.shown}
                  onFocus={amount.open}
                  onClear={amount.clear}
                />

                <ChooserButton
                  title={selectedCategory?.name}
                  placeholder="Chọn nhóm"
                  size="lg"
                  decorLeft={
                    <Image
                      size="xs"
                      source={iconSource(selectedCategory?.icon)}
                      alt={iconName(selectedCategory?.icon)}
                    />
                  }
                  onPress={() => {
                    amount.close();
                    router.push('/transaction-form/category');
                  }}
                />

                <ChooserButton
                  title={draft.note || 'Ghi chú'}
                  size="lg"
                  decorLeft={<NotepadText />}
                  onPress={() => {
                    amount.close();
                    router.push('/transaction-form/note');
                  }}
                />

                <DatePicker
                  value={draft.occurredOn}
                  onChange={draft.setOccurredOn}
                  onOpen={amount.close}
                />
              </View>
            </ScrollView>
          </View>

          <AmountDock
            keypadVisible={amount.mode}
            canSave={!saveDisabled}
            hasExpression={amount.hasExpression}
            saveLabel={pending ? 'Đang lưu...' : 'Lưu'}
            onSave={onSave}
            onKey={amount.push}
            onDone={amount.close}
            onEquals={amount.equals}
            onInsetChange={setDockInset}
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
