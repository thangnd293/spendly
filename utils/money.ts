const moneyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export function formatMoney(amount: number) {
  return Number.isFinite(amount) ? moneyFormatter.format(amount) : '0';
}

export const parseMoney = (s: string) => {
  const digits = s.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
};
