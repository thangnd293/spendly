import useColors from '@/hooks/useColors';
import { useDbQuery } from '@/hooks/useDbQuery';
import { router } from 'expo-router';
import { ChevronRight, CirclePlus, UserRoundGroup, X } from 'lucide-react-native';
import React, { ReactNode, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Center, Divider, HStack, RadioGroup, Text, VStack } from '../ui';
import SwipeToDelete from '../ui/SwipeToDelete';
import { useDraftTransaction } from './DraftTransactionContext';
import { FormRowLeading } from './FormRowLeading';
import ParticipantItem from './ParticipantItem';
import { SplitMode, fillRemainingEqually, splitByShares, splitEqually, sum } from './splitExpense';
import { formatMoney } from '@/utils/money';
import { getPeopleByIds, Person } from '@/data/person';

export const OWNER_ID = '__owner__';

export const OWNER: Person = {
  id: OWNER_ID,
  name: 'Bạn',
  avatarUrl: null,
  isArchived: false,
};

export const isOwner = (id: string) => id === OWNER_ID;

const DEFAULT_SHARE = 1;

const SPLIT_MODE_ITEMS: { value: SplitMode; label: string }[] = [
  { value: 'equal', label: 'Đều' },
  { value: 'shares', label: 'Theo phần' },
  { value: 'custom', label: 'Nhập số' },
];

function QuickFixButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`flex-1 items-center rounded-full bg-background px-3 py-3 ${
        disabled ? 'opacity-40' : 'active:opacity-70'
      }`}
    >
      <Text size="sm" className="font-semibold text-primary" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function QuickFixActions({
  onAssignToOwner,
  onSplitRest,
  assignDisabled,
  splitDisabled,
}: {
  onAssignToOwner: () => void;
  onSplitRest: () => void;
  assignDisabled: boolean;
  splitDisabled: boolean;
}) {
  return (
    <HStack className="mx-4" space="sm">
      <QuickFixButton
        label="Dồn vào phần mình"
        onPress={onAssignToOwner}
        disabled={assignDisabled}
      />
      <QuickFixButton
        label="Chia đều phần còn lại"
        onPress={onSplitRest}
        disabled={splitDisabled}
      />
    </HStack>
  );
}

/* ---------- Sub components ---------- */

function SplitHeaderRow({ trailing }: { trailing: ReactNode }) {
  const colors = useColors();

  return (
    <HStack>
      <FormRowLeading>
        <UserRoundGroup color={colors.primary} />
      </FormRowLeading>
      <HStack className="flex-1 items-center justify-between" space="md">
        <VStack>
          <Text size="2xl">Chia tiền</Text>
          <Text className="text-muted">Chia khoản chi với bạn bè</Text>
        </VStack>
        {trailing}
      </HStack>
    </HStack>
  );
}

function RemainingNote({ remaining }: { remaining: number }) {
  const isBalanced = remaining === 0;
  const label = isBalanced
    ? 'Đã chia đủ'
    : remaining > 0
      ? `Còn thiếu ${formatMoney(remaining)} đ`
      : `Vượt ${formatMoney(-remaining)} đ`;

  return (
    <Text className={`mx-4 text-right ${isBalanced ? 'text-muted' : 'text-red-500'}`}>{label}</Text>
  );
}

/* ---------- Main ---------- */

interface ExpenseSplitSectionProps {
  /** Tổng số tiền của khoản chi cần chia */
  totalAmount: number;
  onPress: () => void;
}

export default function ExpenseSplitSection({ totalAmount, onPress }: ExpenseSplitSectionProps) {
  const colors = useColors();
  const { participants, setParticipants } = useDraftTransaction();

  const { data: people, loading } = useDbQuery(
    (db) => getPeopleByIds(db, participants),
    [participants],
    [],
  );

  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<SplitMode>('equal');
  const [shares, setShares] = useState<Record<string, number>>({});
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});

  // SQL `IN (...)` không đảm bảo thứ tự, nên sắp lại theo đúng thứ tự đã chọn.
  // Id không còn trong DB (bị xoá) sẽ tự bị bỏ qua.
  const members = useMemo(() => {
    const byId = new Map(people.map((p) => [p.id, p]));
    return [OWNER, ...participants.flatMap((id) => byId.get(id) ?? [])];
  }, [people, participants]);

  const amounts = useMemo(() => {
    switch (mode) {
      case 'equal':
        return splitEqually(totalAmount, members.length);
      case 'shares':
        return splitByShares(
          totalAmount,
          members.map((m) => shares[m.id] ?? DEFAULT_SHARE),
        );
      case 'custom':
        return members.map((m) => customAmounts[m.id] ?? 0);
    }
  }, [mode, totalAmount, members, shares, customAmounts]);

  const remaining = totalAmount - sum(amounts);

  // Những người chưa nhập số nào (chưa có key trong customAmounts)
  const unfilledIds = members.filter((m) => customAmounts[m.id] === undefined).map((m) => m.id);
  const ownerAmount = customAmounts[OWNER_ID] ?? 0;

  /** Dồn phần thiếu/vượt vào "Bạn". Vượt thì trừ bớt, không để âm. */
  const handleAssignToOwner = () =>
    setCustomAmounts((current) => ({
      ...current,
      [OWNER_ID]: Math.max((current[OWNER_ID] ?? 0) + remaining, 0),
    }));

  /** Chia đều phần thiếu cho những người chưa nhập. */
  const handleSplitRest = () =>
    setCustomAmounts((current) => ({
      ...current,
      ...fillRemainingEqually(remaining, unfilledIds),
    }));

  const canAssign = remaining !== 0 && !(remaining < 0 && ownerAmount === 0);
  const canSplitRest = remaining > 0 && unfilledIds.length > 0;

  const expand = () => {
    setExpanded(true);
    onPress();
  };

  const removeParticipant = (id: string) =>
    setParticipants((current) => current.filter((x) => x !== id));

  const renderParticipant = ({ id, name, avatarUrl }: Person, amount: number) => {
    const common = { name, avatarUrl, amount };

    switch (mode) {
      case 'equal':
        return <ParticipantItem variant="display" {...common} />;
      case 'shares':
        return (
          <ParticipantItem
            variant="quantity"
            {...common}
            quantity={shares[id] ?? DEFAULT_SHARE}
            onQuantityChange={(value) => setShares((s) => ({ ...s, [id]: value }))}
          />
        );
      case 'custom':
        return (
          <ParticipantItem
            variant="amount"
            {...common}
            maxAmount={totalAmount}
            onAmountChange={(value) => setCustomAmounts((s) => ({ ...s, [id]: value }))}
          />
        );
    }
  };

  if (!expanded) {
    return (
      <Pressable
        accessibilityRole="button"
        className="rounded-3xl bg-surface py-3 active:bg-dragHandle"
        onPress={expand}
      >
        <SplitHeaderRow
          trailing={
            <Center className="mr-4 size-8 rounded-full bg-background">
              <ChevronRight color={colors.primary} />
            </Center>
          }
        />
      </Pressable>
    );
  }

  return (
    <VStack className="rounded-3xl bg-surface py-3" space="md">
      <SplitHeaderRow
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Thu gọn"
            className="mr-4 size-8 items-center justify-center rounded-full bg-background"
            onPress={() => setExpanded(false)}
          >
            <X color={colors.primary} size={18} />
          </Pressable>
        }
      />

      <RadioGroup
        className="mx-4"
        itemClassName="w-1/3"
        items={SPLIT_MODE_ITEMS}
        value={mode}
        onValueChange={setMode}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Thêm thành viên"
        className="mx-4 flex-row items-center justify-center gap-3 rounded-full bg-noteSurface py-3 active:opacity-70"
        onPress={() => router.push('/transaction-form/add-member')}
      >
        <CirclePlus color={colors.primary} />
        <Text className="font-semibold text-primary">Thêm thành viên</Text>
      </Pressable>

      {loading && members.length === 1 && participants.length > 0 ? (
        <ActivityIndicator />
      ) : (
        <View>
          {members.map((member, index) => (
            <React.Fragment key={member.id}>
              {index > 0 ? <Divider className="mx-16" /> : null}
              <SwipeToDelete
                disabled={isOwner(member.id)}
                onDelete={() => removeParticipant(member.id)}
              >
                {renderParticipant(member, amounts[index])}
              </SwipeToDelete>
            </React.Fragment>
          ))}
        </View>
      )}

      {mode === 'custom' ? (
        <VStack space="sm">
          <RemainingNote remaining={remaining} />
          <QuickFixActions
            onAssignToOwner={handleAssignToOwner}
            onSplitRest={handleSplitRest}
            assignDisabled={!canAssign}
            splitDisabled={!canSplitRest}
          />
        </VStack>
      ) : null}
    </VStack>
  );
}
