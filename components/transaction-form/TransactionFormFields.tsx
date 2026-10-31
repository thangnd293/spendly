import { NotepadText } from 'lucide-react-native';
import { RefObject } from 'react';
import { TextInput, View } from 'react-native';

import { ChooserButton } from './ChooserButton';
import { DatePicker } from './DatePicker';
import { AmountField } from './AmountDock/AmountField';
import { Image, RadioGroup } from '@/components/ui';
import { Account } from '@/data/account';
import { Category, CategoryKind } from '@/data/category';
import { iconName, iconSource } from '@/utils/icons';

type TransactionFormFieldsProps = {
  kind: CategoryKind;
  onKindChange: (value: CategoryKind) => void;
  account: Account | null;
  category: Category | null;
  note: string;
  occurredOn: Date;
  onAccountPress: () => void;
  onCategoryPress: () => void;
  onNotePress: () => void;
  onDateChange: (date: Date) => void;
  onDateOpen?: () => void;
  amountInputRef?: RefObject<TextInput | null>;
  amountValue: string;
  autoFocusAmount?: boolean;
  onAmountFocus: () => void;
  onAmountClear: () => void;
};

export function TransactionFormFields({
  kind,
  onKindChange,
  account,
  category,
  note,
  occurredOn,
  onAccountPress,
  onCategoryPress,
  onNotePress,
  onDateChange,
  onDateOpen,
  amountInputRef,
  amountValue,
  autoFocusAmount,
  onAmountFocus,
  onAmountClear,
}: TransactionFormFieldsProps) {
  return (
    <View className="rounded-3xl bg-surface pt-2">
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

      <ChooserButton
        title={account?.name}
        placeholder="Chọn ví"
        decorLeft={
          <Image
            source={iconSource(account?.icon)}
            alt={iconName(account?.icon)}
            size="2xs"
          />
        }
        onPress={onAccountPress}
      />

      <AmountField
        inputRef={amountInputRef}
        autoFocus={autoFocusAmount}
        value={amountValue}
        onFocus={onAmountFocus}
        onClear={onAmountClear}
      />

      <ChooserButton
        title={category?.name}
        placeholder="Chọn nhóm"
        size="lg"
        decorLeft={
          <Image
            source={iconSource(category?.icon)}
            alt={iconName(category?.icon)}
            size="xs"
          />
        }
        onPress={onCategoryPress}
      />

      <ChooserButton
        title={note || 'Ghi chú'}
        size="lg"
        decorLeft={<NotepadText />}
        onPress={onNotePress}
      />
      <DatePicker value={occurredOn} onChange={onDateChange} onOpen={onDateOpen} />
    </View>
  );
}
