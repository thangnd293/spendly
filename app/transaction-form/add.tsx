import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NotepadText } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import {
  AmountDock,
  AmountField,
  ChooserButton,
  DatePicker,
  useAmountDigits,
} from '@/components/transaction-form';
import { useDraftTransaction } from '@/components/transaction-form/DraftTransactionContext';
import { Image, RadioGroup } from '@/components/ui';
import { getAccountById } from '@/data/account';
import { CategoryKind, getCategoryById } from '@/data/category';
import { insertTransaction } from '@/data/transaction';
import { useDbMutation } from '@/hooks/useDbMutation';
import { useDbQuery } from '@/hooks/useDbQuery';
import { formatDateForStorage } from '@/utils/date';
import { iconName, iconSource } from '@/utils/icons';

export default function AddTransactionScreen() {
  const amount = useAmountDigits();
  const [dockInset, setDockInset] = useState(0);
  const {
    account,
    occurredOn,
    category,
    setCategory,
    note,
    setOccurredOn,
    kind,
    setKind,
    resetValues,
  } = useDraftTransaction();

  useEffect(() => {
    resetValues();
  }, []);

  const { data: selectedAccount } = useDbQuery(
    (db) => getAccountById(db, account),
    [account],
    null,
  );

  const { data: selectedCategory } = useDbQuery(
    (db) => getCategoryById(db, category),
    [category],
    null,
  );

  const { run: save } = useDbMutation(insertTransaction);

  const saveDisabled = !account || !category || amount.amountVnd <= 0 || !occurredOn;

  async function onSave() {
    if (saveDisabled) return;

    await save({
      accountId: account,
      amountVnd: amount.amountVnd,
      categoryId: category,
      note,
      occurredOn: formatDateForStorage(occurredOn),
      type: kind,
    });

    router.back();
  }

  function onKindChange(value: CategoryKind) {
    setKind(value);
    setCategory(null);
  }

  return (
    <View className="flex-1">
      {/* Use a light status bar on iOS to account for the black space above the modal */}
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
              value={kind}
              onValueChange={onKindChange}
            />
          </View>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: dockInset,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="rounded-b-3xl bg-surface pt-2">
              <ChooserButton
                title={selectedAccount?.name}
                decorLeft={
                  <Image
                    source={iconSource(selectedAccount?.icon)}
                    alt={iconName(selectedAccount?.icon)}
                    size="2xs"
                  />
                }
                onPress={() => router.push('/transaction-form/account')}
              />

              <AmountField
                inputRef={amount.inputRef}
                autoFocus
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
                    source={iconSource(selectedCategory?.icon)}
                    alt={iconName(selectedCategory?.icon)}
                    size="xs"
                  />
                }
                onPress={() => router.push('/transaction-form/category')}
              />

              <ChooserButton
                title={note || 'Ghi chú'}
                size="lg"
                decorLeft={<NotepadText />}
                onPress={() => router.push('/transaction-form/note')}
              />
              <DatePicker value={occurredOn} onChange={setOccurredOn} />
            </View>
          </ScrollView>
        </View>

        <AmountDock
          keypadVisible={amount.mode}
          canSave={!saveDisabled}
          hasExpression={amount.hasExpression}
          onSave={onSave}
          onKey={amount.push}
          onDone={amount.close}
          onEquals={amount.equals}
          onInsetChange={setDockInset}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
