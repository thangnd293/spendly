import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';

export function useDbMutation<TInput, TResult>(
  mutate: (db: SQLiteDatabase, input: TInput) => Promise<TResult>,
) {
  const db = useSQLiteContext();
  const [pending, setPending] = useState(false);
  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  const run = useCallback(
    async (input: TInput) => {
      setPending(true);
      try {
        return await mutateRef.current(db, input);
      } finally {
        setPending(false);
      }
    },
    [db],
  );

  return { run, pending };
}
