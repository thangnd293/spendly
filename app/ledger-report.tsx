import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { ChartNoAxesColumnIncreasing } from 'lucide-react-native';

import ScrollTabs from '@/components/ledger/ScrollTabs/ScrollTabs';
import ExpenseBreakdown from '@/components/ledger/ExpenseBreakdown';
import { useReportRange } from '@/components/ledger-report/useReportRange';
import PeriodChartCard from '@/components/ledger-report/PeriodChartCard';
import NetIncomeCard from '@/components/ledger-report/NetIncomeCard';

const MOCK_EXPENSES = [780000, 920000, 680000, 1200000, 860000, 950000];

export default function LedgerReportScreen() {
  const { tabs, selected, setSelected, periods } = useReportRange();

  // TODO: thay bằng data thật, query theo từng period.from / period.to
  const expenses = useMemo(() => periods.map((_, i) => MOCK_EXPENSES[i] ?? 0), [periods]);

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 px-6 pb-6 mt-1">
      <NetIncomeCard
        netIncome={500000}
        changePercent={12}
        openingBalance={500000}
        income={500000}
        closingBalance={500000}
      >
        <ScrollTabs tabs={tabs} value={selected} onValueChange={setSelected} />
      </NetIncomeCard>

      <PeriodChartCard
        title="Biểu đồ chi tiêu"
        icon={ChartNoAxesColumnIncreasing}
        periods={periods}
        values={expenses}
      />

      <ExpenseBreakdown />
    </ScrollView>
  );
}
