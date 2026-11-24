import { formatMoney, parseMoney } from '@/utils/money';
import { TextInput } from 'react-native';
import { Center, HStack, Text } from '../ui';
import Avatar from '../ui/Avatar';
import NumberInput from '../ui/NumberInput';

/* ---------- MoneyInput ---------- */

type MoneyInputProps = {
  value: number;
  onChange: (value: number) => void;
  /** Giá trị tối đa cho phép, mặc định 999 tỷ */
  max?: number;
  disabled?: boolean;
};

const DEFAULT_MAX_MONEY = 999_999_999_999;

function MoneyInput({ value, onChange, max = DEFAULT_MAX_MONEY, disabled }: MoneyInputProps) {
  const text = value ? formatMoney(value) : '';

  const handleChangeText = (t: string) => {
    const parsed = parseMoney(t);
    // Vượt max thì kẹp về max, người dùng thấy ngay số dừng lại ở mức trần
    onChange(Math.min(parsed, max));
  };

  return (
    <HStack className="items-center rounded-full bg-background px-4 py-1" space="xs">
      <TextInput
        className="min-w-24 text-right"
        value={text}
        onChangeText={handleChangeText}
        placeholder="0"
        keyboardType="number-pad"
        selectTextOnFocus
        editable={!disabled}
        maxLength={String(max).length + Math.floor((String(max).length - 1) / 3)}
        accessibilityLabel="Số tiền"
      />
      <Text className="text-muted">đ</Text>
    </HStack>
  );
}
/* ---------- AmountPill ---------- */

function AmountPill({ amount }: { amount: number }) {
  return (
    <Center className="rounded-full bg-background px-4 py-2">
      <Text>{formatMoney(amount)} đ</Text>
    </Center>
  );
}

/* ---------- Props ---------- */

type BaseProps = {
  name: string;
  avatarUrl?: string | null;
  amount: number;
};

type DisplayProps = BaseProps & {
  variant: 'display';
};

type QuantityProps = BaseProps & {
  variant: 'quantity';
  quantity: number;
  onQuantityChange: (value: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
};

type AmountProps = BaseProps & {
  variant: 'amount';
  onAmountChange: (value: number) => void;
  maxAmount?: number;
};

export type ParticipantItemProps = DisplayProps | QuantityProps | AmountProps;

/* ---------- Main ---------- */

export default function ParticipantItem(props: ParticipantItemProps) {
  const { name, avatarUrl } = props;

  const renderRight = () => {
    switch (props.variant) {
      case 'display':
        return <AmountPill amount={props.amount} />;

      case 'quantity':
        return (
          <HStack className="items-center" space="md">
            <NumberInput
              value={props.quantity}
              onChange={props.onQuantityChange}
              min={props.minQuantity ?? 1}
              max={props.maxQuantity ?? 10}
            />
            <AmountPill amount={props.amount} />
          </HStack>
        );

      case 'amount':
        return (
          <MoneyInput value={props.amount} onChange={props.onAmountChange} max={props.maxAmount} />
        );
    }
  };

  return (
    <HStack className="items-center justify-between px-5 py-2" space="md">
      {/* flex-1 + min-w-0 để tên dài tự cắt "..." thay vì đẩy phần bên phải ra ngoài */}
      <HStack className="min-w-0 flex-1 items-center" space="md">
        <Avatar name={name} uri={avatarUrl} />
        <Text size="lg" numberOfLines={1} className="flex-shrink">
          {name}
        </Text>
      </HStack>

      {renderRight()}
    </HStack>
  );
}
