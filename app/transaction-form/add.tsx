import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import {
  AmountDock,
  TransactionFormFields,
  useAmountDigits,
} from '@/components/transaction-form';
import { useDraftTransaction } from '@/components/transaction-form/DraftTransactionContext';
import { getAccountById } from '@/data/account';
import { CategoryKind, getCategoryById } from '@/data/category';
import { insertTransaction } from '@/data/transaction';
import { useDbMutation } from '@/hooks/useDbMutation';
import { useDbQuery } from '@/hooks/useDbQuery';
import { formatDateForStorage } from '@/utils/date';

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
          <ScrollView
            contentContainerStyle={{
              paddingBottom: dockInset,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <TransactionFormFields
              kind={kind}
              onKindChange={onKindChange}
              account={selectedAccount}
              category={selectedCategory}
              note={note}
              occurredOn={occurredOn}
              onAccountPress={() => router.push('/transaction-form/account')}
              onCategoryPress={() => router.push('/transaction-form/category')}
              onNotePress={() => router.push('/transaction-form/note')}
              onDateChange={setOccurredOn}
              amountInputRef={amount.inputRef}
              amountValue={amount.mode ? amount.formattedExpression : amount.shown}
              autoFocusAmount
              onAmountFocus={amount.open}
              onAmountClear={amount.clear}
            />
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
