export type SplitMode = 'equal' | 'shares' | 'custom';

export function sum(values: number[]) {
  return values.reduce((total, v) => total + v, 0);
}

/** Chia đều, phần dư (do làm tròn) được rải 1đ cho những người đầu danh sách. */
export function splitEqually(total: number, count: number): number[] {
  if (count === 0) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

/** Chia theo tỉ lệ số phần, phần dư rải cho những người có phần > 0. */
export function splitByShares(total: number, shares: number[]): number[] {
  const totalShares = sum(shares);
  if (totalShares === 0) return shares.map(() => 0);

  const amounts = shares.map((share) => Math.floor((total * share) / totalShares));
  let remainder = total - sum(amounts);

  for (let i = 0; remainder > 0; i = (i + 1) % amounts.length) {
    if (shares[i] > 0) {
      amounts[i] += 1;
      remainder -= 1;
    }
  }
  return amounts;
}

/** Chia đều phần thiếu cho những người chưa nhập. Trả về map id -> số tiền. */
export function fillRemainingEqually(
  remaining: number,
  unfilledIds: string[],
): Record<string, number> {
  if (remaining <= 0 || unfilledIds.length === 0) return {};
  const parts = splitEqually(remaining, unfilledIds.length);
  return Object.fromEntries(unfilledIds.map((id, i) => [id, parts[i]]));
}
