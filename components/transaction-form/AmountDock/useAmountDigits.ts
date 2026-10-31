import { ElementRef, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { formatMoney } from '@/utils/money';
import {
  appendEntry,
  applyOp,
  CalcKey,
  CLEAR_KEY,
  commitState,
  DELETE_KEY,
  DIVIDE,
  entryValue,
  expressionOf,
  formatEntry,
  formatExpression,
  initialState,
  MINUS,
  MULTIPLY,
  PLUS,
  previewValue,
  roundCalc,
} from './calculator';

export function useAmountDigits(initial = '') {
  const [state, setState] = useState(() => initialState(initial));
  const [mode, setMode] = useState(true);
  const inputRef = useRef<TextInput>(null);
  const amount = previewValue(state);

  useEffect(() => {
    setState(initialState(initial));
    setMode(false);
  }, [initial]);

  function push(key: CalcKey) {
    setState((current) => {
      if (key === CLEAR_KEY) return initialState('');

      if (key === DELETE_KEY) {
        if (current.fresh) {
          const shown = formatEntry(current.acc ?? entryValue(current.entry));
          const next = shown.length <= 1 ? '0' : shown.slice(0, -1);
          return {
            acc: null,
            op: null,
            entry: next === '-' ? '0' : next,
            fresh: false,
          };
        }

        const next = current.entry.slice(0, -1);
        return { ...current, entry: next === '-' ? '' : next };
      }

      if (key === PLUS || key === MINUS || key === MULTIPLY || key === DIVIDE) {
        if (current.acc !== null && current.op && !current.fresh) {
          const next = applyOp(current.acc, current.op, entryValue(current.entry));
          if (next === null) return current;

          return {
            acc: next,
            op: key,
            entry: formatEntry(next),
            fresh: true,
          };
        }

        const base =
          current.fresh && current.acc !== null ? current.acc : entryValue(current.entry);
        const acc = roundCalc(base);

        return { acc, op: key, entry: formatEntry(acc), fresh: true };
      }

      return {
        ...current,
        entry: appendEntry(current.entry, key, current.fresh),
        fresh: false,
      };
    });
  }

  function close() {
    setState((current) => commitState(current));
    inputRef.current?.blur();
    setMode(false);
  }

  return {
    digits: String(Math.max(0, Math.round(amount))),
    shown: state.acc === null && state.entry === '' ? '' : formatMoney(amount),
    formattedExpression: formatExpression(expressionOf(state)),
    hasExpression: state.op !== null,
    amountVnd: Math.max(0, roundCalc(amount)),
    mode,
    inputRef,
    open: () => setMode(true),
    close,
    equals: () => setState((current) => commitState(current)),
    push,
    clear: () => setState(initialState('')),
  };
}
