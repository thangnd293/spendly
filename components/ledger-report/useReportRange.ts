import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { createMonthTabs } from '@/components/ledger/ScrollTabs/createMonthTabs';
import { parseDate } from '@/utils/params';
import { buildPeriods } from '@/utils/period';

const START_DATE = 25;
const TABS = createMonthTabs(START_DATE);
const DEFAULT_TAB = TABS.find((t) => t.label.startsWith('Tháng này (')) ?? TABS[0];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function useReportRange(periodCount = 6) {
  const params = useLocalSearchParams<{ from?: string; to?: string }>();

  const [selected, setSelected] = useState(() => {
    const fromDate = parseDate(params.from);
    const matched = fromDate ? TABS.find((t) => isSameDay(t.from, fromDate)) : undefined;
    return (matched ?? DEFAULT_TAB).key;
  });

  const tab = TABS.find((t) => t.key === selected);
  const from = tab?.from ?? parseDate(params.from);
  const to = tab?.to ?? parseDate(params.to);

  const fromTime = from?.getTime();
  const toTime = to?.getTime();

  const periods = useMemo(
    () =>
      fromTime != null && toTime != null
        ? buildPeriods(new Date(fromTime), new Date(toTime), periodCount)
        : [],
    [fromTime, toTime, periodCount],
  );

  return { tabs: TABS, selected, setSelected, from, to, periods };
}
