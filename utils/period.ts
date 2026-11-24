const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

export type Period = {
  key: string;
  from: Date;
  to: Date;
  label: string;
  isCurrent: boolean;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const addDays = (d: Date, n: number) => {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
};

const diffDays = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);

// Cộng tháng, kẹp ngày cho tháng ngắn (31 -> 28/30)
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
};

// Range "theo tháng": to = (from + 1 tháng) - 1 ngày. Vd 25/09 -> 24/10
const isMonthAligned = (from: Date, to: Date) => diffDays(addMonths(from, 1), to) === -1;

const fmtDM = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

/** Tạo `count` kỳ liên tiếp kết thúc ở range hiện tại (kỳ cuối = kỳ hiện tại). */
export function buildPeriods(from: Date, to: Date, count = 6): Period[] {
  const monthly = isMonthAligned(from, to);
  const span = diffDays(from, to) + 1;

  return Array.from({ length: count }, (_, idx) => {
    const back = count - 1 - idx;
    const f = monthly ? addMonths(from, -back) : addDays(from, -back * span);
    const t = monthly ? addDays(addMonths(from, -back + 1), -1) : addDays(f, span - 1);

    let label: string;
    if (monthly) label = `T${t.getMonth() + 1}`;
    else if (span === 1) label = fmtDM(f);
    else label = `${fmtDM(f)}\n${fmtDM(t)}`;

    return { key: f.toISOString(), from: f, to: t, label, isCurrent: back === 0 };
  });
}

/** 500000 -> "500k", 1200000 -> "1,2tr" */
export function formatCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${+(abs / 1_000_000).toFixed(1)}tr`.replace('.', ',');
  if (abs >= 1_000) return `${Math.round(abs / 1_000)}k`;
  return `${abs}`;
}

/** Làm tròn trục lên giá trị "đẹp": 1.2tr -> 2tr, 680k -> 1tr */
export function niceCeil(value: number) {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * pow;
}
