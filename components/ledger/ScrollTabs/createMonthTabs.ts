export type MonthTab = {
  index: number;
  key: string;
  from: Date;
  to: Date | null;
  label: string;
};

function createPeriodStart(year: number, month: number, startDate: number) {
  return new Date(year, month, startDate, 12);
}

function formatDate(date: Date, includeYear: boolean) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return includeYear ? `${day}/${month}/${date.getFullYear()}` : `${day}/${month}`;
}

function formatRange(from: Date, to: Date, includeYear: boolean) {
  return `${formatDate(from, includeYear)} - ${formatDate(to, includeYear)}`;
}

export function createMonthTabs(startDate: number, now = new Date()): MonthTab[] {
  if (!Number.isInteger(startDate) || startDate < 1 || startDate > 28) {
    throw new RangeError('startDate must be an integer between 1 and 28');
  }

  const currentStartMonth = now.getDate() >= startDate ? now.getMonth() : now.getMonth() - 1;
  const currentStart = createPeriodStart(now.getFullYear(), currentStartMonth, startDate);
  const earliestStart = createPeriodStart(
    currentStart.getFullYear(),
    currentStart.getMonth() - 18,
    startDate,
  );

  const tabs: MonthTab[] = [];
  let index = 0;
  for (
    let from = earliestStart;
    from.getTime() <= currentStart.getTime();
    from = createPeriodStart(from.getFullYear(), from.getMonth() + 1, startDate)
  ) {
    const to = new Date(from.getFullYear(), from.getMonth() + 1, startDate - 1, 12);
    const isCurrent = from.getTime() === currentStart.getTime();
    const isPrevious =
      from.getTime() ===
      createPeriodStart(
        currentStart.getFullYear(),
        currentStart.getMonth() - 1,
        startDate,
      ).getTime();
    const isDifferentYear = from.getFullYear() !== currentStart.getFullYear();
    const range = formatRange(from, to, isDifferentYear);
    const label = isCurrent
      ? `Tháng này (${range})`
      : isPrevious
        ? `Tháng trước (${range})`
        : range;

    tabs.push({
      index,
      key: `month-${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}`,
      from,
      to,
      label,
    });

    index++;
  }

  const futureFrom = createPeriodStart(
    currentStart.getFullYear(),
    currentStart.getMonth() + 1,
    startDate,
  );
  tabs.push({
    index,
    key: 'future',
    from: futureFrom,
    to: null,
    label: 'Tương lai',
  });

  return tabs;
}
