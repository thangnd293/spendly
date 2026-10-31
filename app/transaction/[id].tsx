import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Calendar, Copy } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useState } from 'react';

import { FormRowLeading } from '@/components/transaction-form';
import {
  ConfirmAlertDialog,
  Divider,
  HStack,
  Image,
  Text,
  VStack,
} from '@/components/ui';
import { deleteTransaction, getTransactionById } from '@/data/transaction';
import useColors from '@/hooks/useColors';
import { useDbQuery } from '@/hooks/useDbQuery';
import { useDbMutation } from '@/hooks/useDbMutation';
import { iconName, iconSource } from '@/utils/icons';
import { formatMoney } from '@/utils/money';
import { formatDate } from '@/utils/date';

export default function TransactionDetailScreen() {
  const colors = useColors();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: transaction } = useDbQuery(
    (db) => (id ? getTransactionById(db, id) : Promise.resolve(null)),
    [id],
    null,
  );
  const { run: deleteTransactionMutation, pending: deleting } = useDbMutation(deleteTransaction);

  async function onDelete() {
    if (!id || deleting) return;

    setDeleteError(null);
    try {
      await deleteTransactionMutation(id);
      setDeleteDialogOpen(false);
      router.back();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Không thể xóa giao dịch');
    }
  }

  if (!transaction) return;

  const isIncome = transaction.type === 'income';

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sửa giao dịch"
              hitSlop={8}
              onPress={() =>
                router.push({
                  pathname: '/transaction-form/[id]',
                  params: { id },
                })
              }
              className="rounded-full p-2 active:bg-black/10"
            >
              <Text>Sửa</Text>
            </Pressable>
          ),
        }}
      />
      <View className="m-6 rounded-3xl bg-surface py-4">
        <HStack>
          <View className="w-20 items-center">
            <Image
              size="md"
              source={iconSource(transaction.categoryIcon)}
              alt={iconName(transaction.categoryIcon)}
            />
          </View>
          <VStack className="mt-2.5 flex-1" space="md">
            <Text size="xl">{transaction.title}</Text>
            <Text className={isIncome ? 'text-income' : 'text-spend'} size="4xl">
              {formatMoney(transaction.amountVnd)} ₫
            </Text>
            <Divider />
          </VStack>
        </HStack>

        <VStack className="my-5" space="md">
          <HStack className="items-center">
            <FormRowLeading>
              <Calendar />
            </FormRowLeading>
            <Text>{formatDate(transaction.occurredOn)}</Text>
          </HStack>

          <HStack className="items-center">
            <FormRowLeading>
              <Image
                size="xs"
                source={iconSource(transaction.categoryIcon)}
                alt={iconName(transaction.categoryIcon)}
              />
            </FormRowLeading>
            <Text>{transaction.accountName}</Text>
          </HStack>
        </VStack>
        <View className="mx-6 rounded-3xl bg-green-50 p-4">
          <HStack space="xs">
            <Text className="text-primary">❞</Text>
            <Text className="font-semibold text-primary">Ghi chú</Text>
          </HStack>
          <Text size="lg">{transaction.note}</Text>
        </View>
      </View>

      <View className="m-6 overflow-hidden rounded-3xl bg-surface">
        <Pressable className="flex-row items-center justify-center gap-2 p-3">
          <Copy size={16} color={colors.primary} />
          <Text className="text-primary">Sao chép</Text>
        </Pressable>
        <Divider />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa giao dịch"
          className="items-center p-3 active:bg-black/10"
          onPress={() => {
            setDeleteError(null);
            setDeleteDialogOpen(true);
          }}
        >
          <Text className="text-spend">Xóa giao dịch</Text>
        </Pressable>
      </View>

      <ConfirmAlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          if (!deleting) setDeleteDialogOpen(false);
        }}
        onConfirm={onDelete}
        title="Xóa giao dịch?"
        description="Giao dịch này sẽ bị xóa vĩnh viễn và không thể khôi phục."
        confirmText="Xóa"
        pending={deleting}
        error={deleteError}
      />
    </>
  );
}
