import {
  ChevronRight,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { FormRowLeading } from '@/components/transaction-form';
import EmptyState from '@/components/ledger/EmptyState';
import LedgerReportModal from '@/components/ledger/LedgerReportModal';
import ScrollTabs from '@/components/ledger/ScrollTabs/ScrollTabs';
import TransactionGroupByDate from '@/components/TransactionGroupByDate';
import { Center, Divider, HStack, Text, VStack } from '@/components/ui';
import { getTransactionBalanceSummary, listGroupedTransactions } from '@/data/transaction';
import { useDbQuery } from '@/hooks/useDbQuery';
import { formatMoney } from '@/utils/money';
import { createMonthTabs } from '@/components/ledger/ScrollTabs/createMonthTabs';

const START_DATE = 25;
const TABS = createMonthTabs(START_DATE);

const INITIAL_PAGE = TABS.findIndex((tab) => tab.label.startsWith('Tháng này ('));
export default function LedgerScreen() {
  const [selected, setSelected] = useState(TABS[INITIAL_PAGE].key);
  const [reportOpen, setReportOpen] = useState(false);
  const selectedTab = TABS.find((tab) => tab.key === selected);

  const { data: transactions } = useDbQuery(
    (db) => listGroupedTransactions(db, selectedTab?.from ?? null, selectedTab?.to ?? null),
    [selectedTab?.from, selectedTab?.to],
    [],
  );
  const { data: balanceSummary } = useDbQuery(
    (db) => getTransactionBalanceSummary(db, selectedTab?.from ?? null, selectedTab?.to ?? null),
    [selectedTab?.from, selectedTab?.to],
    { openingBalanceVnd: 0, closingBalanceVnd: 0, changeVnd: 0 },
  );

  const isBalanceIncreased = balanceSummary.changeVnd >= 0;

  return (
    <View className="flex-1">
      <VStack className="mx-4 h-72 justify-between rounded-xl bg-surface p-3">
        <ScrollTabs tabs={TABS} value={selected} onValueChange={setSelected} />
        {transactions.length === 0 && <EmptyState />}
        {transactions.length > 0 && (
          <>
            <HStack className="mt-4 items-center" space="md">
              <FormRowLeading>
                <Center className="rounded-full bg-green-50 p-3.5">
                  <Wallet color="green" />
                </Center>
              </FormRowLeading>

              <VStack className="flex-1">
                <Text className="font-semibold text-muted" size="sm">
                  Số dư đầu
                </Text>
                <Text size="lg" bold>
                  {formatMoney(balanceSummary.openingBalanceVnd)} ₫
                </Text>
              </VStack>
            </HStack>

            <Divider />

            <HStack className="items-center" space="md">
              <FormRowLeading>
                <Center className="rounded-full bg-green-50 p-3.5">
                  <CircleDollarSign color="green" />
                </Center>
              </FormRowLeading>
              <VStack className="flex-1">
                <Text className="font-semibold text-muted" size="sm">
                  Số dư cuối
                </Text>
                <Text size="lg" bold>
                  {formatMoney(balanceSummary.closingBalanceVnd)} ₫
                </Text>
              </VStack>
              <HStack
                className={`rounded-full px-3 py-2 ${isBalanceIncreased ? 'bg-green-50' : 'bg-red-50'}`}
                space="sm"
              >
                {isBalanceIncreased ? (
                  <TrendingUp color="green" size={14} />
                ) : (
                  <TrendingDown color="red" size={14} />
                )}
                <Text
                  className={isBalanceIncreased ? 'text-green-700' : 'text-red-700'}
                  size="xs"
                  bold
                >
                  {formatMoney(Math.abs(balanceSummary.changeVnd))} ₫
                </Text>
              </HStack>
            </HStack>
            <Pressable
              className="flex-row items-center rounded-lg bg-green-50 px-3 py-3"
              onPress={() => setReportOpen(true)}
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Center className="size-5 rounded-full bg-primary">
                <Text className="text-white" size="sm">
                  i
                </Text>
              </Center>
              <Text className="ml-3 flex-1 text-primary" size="sm">
                Xem báo cáo cho giai đoạn này
              </Text>
              <ChevronRight size={16} color="#3fbc5b" strokeWidth={2} />
            </Pressable>
          </>
        )}
      </VStack>
      <VStack className="flex-1">
        <FlatList
          className="my-10 px-6"
          data={transactions}
          ItemSeparatorComponent={() => <View className="h-6" />}
          renderItem={({ item }) => (
            <TransactionGroupByDate
              date={item.date}
              totalAmount={item.totalAmountVnd}
              transactions={item.transactions}
            />
          )}
          keyExtractor={(item) => item.date}
        />
      </VStack>

      <LedgerReportModal
        visible={reportOpen}
        from={selectedTab?.from ?? null}
        to={selectedTab?.to ?? null}
        onClose={() => setReportOpen(false)}
      />
    </View>
  );
}
