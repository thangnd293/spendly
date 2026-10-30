import { useFocusEffect } from 'expo-router';
import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';

export function useDbQuery<T>(
  query: (db: SQLiteDatabase) => Promise<T>,
  deps: readonly unknown[],
  initial: T,
) {
  const db = useSQLiteContext();
  const [data, setData] = useState(initial);
  const queryRef = useRef(query);
  queryRef.current = query;

  const reload = useCallback(async () => {
    setData(await queryRef.current(db));
  }, [db, ...deps]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      void queryRef.current(db).then((next) => {
        if (active) setData(next);
      });

      return () => {
        active = false;
      };
    }, [db, ...deps]),
  );

  return { data, reload };
}
