import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

import { CategoryKind } from '@/data/category';
import { SAMPLE_CATEGORIES } from '@/data/sample';

export type DraftTransactionContextValue = {
  participants: string[];
  setParticipants: Dispatch<SetStateAction<string[]>>;
  account: string | null;
  setAccount: Dispatch<SetStateAction<string | null>>;
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  category: string | null;
  setCategory: Dispatch<SetStateAction<string | null>>;
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
  occurredOn: Date;
  setOccurredOn: Dispatch<SetStateAction<Date>>;
  kind: CategoryKind;
  setKind: Dispatch<SetStateAction<CategoryKind>>;
  resetValues: () => void;
};

const DraftTransactionContext = createContext<DraftTransactionContextValue | null>(null);

export function DraftTransactionProvider({ children }: PropsWithChildren) {
  const [participants, setParticipants] = useState<string[]>(['Bạn']);
  const [account, setAccount] = useState<string | null>('acc_cash');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<string | null>(SAMPLE_CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [occurredOn, setOccurredOn] = useState(() => new Date());
  const [kind, setKind] = useState<CategoryKind>('spend');

  const resetValues = useCallback(() => {
    setParticipants(['Bạn']);
    setAccount('acc_cash');
    setCategory(SAMPLE_CATEGORIES[0].id);
    setNote('');
    setAmount(0);
    setOccurredOn(new Date());
    setKind('spend');
  }, []);

  return (
    <DraftTransactionContext.Provider
      value={{
        participants,
        setParticipants,
        account,
        setAccount,
        amount,
        setAmount,
        category,
        setCategory,
        note,
        setNote,
        occurredOn,
        setOccurredOn,
        kind,
        setKind,
        resetValues,
      }}
    >
      {children}
    </DraftTransactionContext.Provider>
  );
}

export function useDraftTransaction() {
  const context = useContext(DraftTransactionContext);

  if (!context) {
    throw new Error('useDraftTransaction must be used within DraftTransactionProvider');
  }

  return context;
}
