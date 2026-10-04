export const PLUS = '+' as const;
export const MINUS = '−' as const;
export const MULTIPLY = '×' as const;
export const DIVIDE = '÷' as const;
export const DELETE_KEY = '⌫' as const;
export const CLEAR_KEY = 'C' as const;
export const DECIMAL = '.' as const;
export const THOUSAND = '000' as const;

export type DigitKey =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | typeof THOUSAND | typeof DECIMAL;
export type OpKey = typeof PLUS | typeof MINUS | typeof MULTIPLY | typeof DIVIDE;
export type CalcKey = DigitKey | OpKey | typeof DELETE_KEY | typeof CLEAR_KEY;

export const KEY_MARGIN = 4;
export const MIN_BOTTOM_INSET = 8;
export const ANIMATION_DURATION_MS = 240;
export const MAX_INT_DIGITS = 12;
export const MAX_FRAC_DIGITS = 2;

const LEADING_ZEROES_PATTERN = /^0+(?=\d)/;
const THOUSANDS_GROUPING_PATTERN = /\B(?=(\d{3})+(?!\d))/g;

export const KEYPAD_ROWS = [
  [CLEAR_KEY, DIVIDE, MULTIPLY, DELETE_KEY],
  ['7', '8', '9', MINUS],
  ['4', '5', '6', PLUS],
] as const satisfies ReadonlyArray<readonly CalcKey[]>;

export const KEYPAD_BOTTOM_ROW = [
  ['1', '0'],
  ['2', THOUSAND],
  ['3', DECIMAL],
] as const satisfies ReadonlyArray<readonly CalcKey[]>;

export type CalcState = {
  acc: number | null;
  op: OpKey | null;
  entry: string;
  fresh: boolean;
};

export function roundCalc(n: number) {
  return Math.round(n * 100) / 100;
}

function groupInteger(integer: string, separator: '.' | ',') {
  return integer.replace(THOUSANDS_GROUPING_PATTERN, separator);
}

export function formatEntry(n: number) {
  if (!Number.isFinite(n)) return '0';
  const rounded = roundCalc(n);
  if (rounded === 0) return '0';
  return rounded.toFixed(MAX_FRAC_DIGITS).replace(/\.?0+$/, '');
}

export function entryValue(entry: string) {
  if (entry === '' || entry === '.' || entry === '-') return 0;
  const n = Number(entry);
  return Number.isFinite(n) ? n : 0;
}

export function applyOp(a: number, op: OpKey, b: number) {
  switch (op) {
    case PLUS:
      return roundCalc(a + b);
    case MINUS:
      return roundCalc(a - b);
    case MULTIPLY:
      return roundCalc(a * b);
    case DIVIDE:
      return b === 0 ? null : roundCalc(a / b);
    default:
      return a;
  }
}

export function limitEntry(raw: string) {
  const isNegative = raw.startsWith('-');
  const body = isNegative ? raw.slice(1) : raw;
  const [intPart = '', frac] = body.split('.');
  const intTrim = intPart.replace(LEADING_ZEROES_PATTERN, '').slice(0, MAX_INT_DIGITS);
  const intShown = intTrim === '' ? '0' : intTrim;
  const signed = `${isNegative ? '-' : ''}${intShown}`;
  if (frac === undefined) return signed;

  return `${signed}.${frac.slice(0, MAX_FRAC_DIGITS)}`;
}

export function appendEntry(entry: string, key: DigitKey, fresh: boolean) {
  const base = fresh ? '' : entry;

  if (key === DECIMAL) {
    if (fresh || base === '' || base === '0') return '0.';
    if (base.includes('.')) return base;
    return `${base}.`;
  }

  if (key === THOUSAND) {
    if (fresh || base === '' || base === '0') return '0';
    return limitEntry(`${base}000`);
  }

  if (fresh || base === '' || base === '0') return key;

  return limitEntry(`${base}${key}`);
}

export function previewValue(state: CalcState) {
  if (state.fresh && state.acc !== null) return state.acc;
  if (state.acc === null || state.op === null) return entryValue(state.entry);
  return applyOp(state.acc, state.op, entryValue(state.entry)) ?? state.acc;
}

export function commitState(state: CalcState): CalcState {
  return {
    acc: null,
    op: null,
    entry: state.acc === null && state.entry === '' ? '' : formatEntry(previewValue(state)),
    fresh: false,
  };
}

export function expressionOf(state: CalcState) {
  if (state.acc !== null && state.op !== null) {
    const left = formatEntry(state.acc);
    return state.fresh ? `${left} ${state.op}` : `${left} ${state.op} ${state.entry || '0'}`;
  }

  return state.entry;
}

export function initialState(initial: string): CalcState {
  const digits = initial.replace(/\D/g, '').replace(LEADING_ZEROES_PATTERN, '');

  return {
    acc: null,
    op: null,
    entry: digits.slice(0, MAX_INT_DIGITS),
    fresh: false,
  };
}

export function formatExpression(expression: string) {
  return expression.replace(/-?\d+(?:\.\d*)?/g, (value) => {
    const negative = value.startsWith('-');
    const unsigned = negative ? value.slice(1) : value;
    const [integer, fraction] = unsigned.split('.');
    const grouped = groupInteger(integer, ',');

    return `${negative ? '-' : ''}${grouped}${fraction === undefined ? '' : `.${fraction}`}`;
  });
}

export const OP_KEYS = new Set<CalcKey>([CLEAR_KEY, DIVIDE, MULTIPLY, DELETE_KEY, MINUS, PLUS]);
