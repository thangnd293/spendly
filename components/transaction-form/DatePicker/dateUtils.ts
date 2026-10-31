export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 12);
}

export function toYmd(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromYmd(ymd: string) {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function formatBar(date: Date) {
  const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' })
    .format(date)
    .replace(/(^|\s)\p{L}/gu, (letter) => letter.toUpperCase());
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${weekday}, ${day}/${month}/${date.getFullYear()}`;
}
