import { useState } from 'react';
import { FlatList, View } from 'react-native';

import EmptyState from '@/components/ledger/EmptyState';
import { LedgerBalanceSummary } from '@/components/ledger/LedgerBalanceSummary';
import { LedgerReportButton } from '@/components/ledger/LedgerReportButton';
import LedgerReportModal from '@/components/ledger/LedgerReportModal';
import ScrollTabs from '@/components/ledger/ScrollTabs/ScrollTabs';
import TransactionGroupByDate from '@/components/TransactionGroupByDate';
import { VStack } from '@/components/ui';
import { getTransactionBalanceSummary, listGroupedTransactions } from '@/data/transaction';
import { useDbQuery } from '@/hooks/useDbQuery';
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

  return (
    <View className="flex-1">
      <VStack className="mx-4 h-72 justify-between rounded-xl bg-surface p-3">
        <ScrollTabs tabs={TABS} value={selected} onValueChange={setSelected} />
        {transactions.length === 0 && <EmptyState />}
        {transactions.length > 0 && (
          <>
            <LedgerBalanceSummary summary={balanceSummary} />
            <LedgerReportButton onPress={() => setReportOpen(true)} />
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
