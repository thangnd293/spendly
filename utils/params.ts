export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDate(value: string | string[] | undefined) {
  const param = firstParam(value);
  if (!param) return null;
  const date = new Date(param);
  return Number.isNaN(date.getTime()) ? null : date;
}
