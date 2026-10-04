import { SAMPLE_ACCOUNTS, SAMPLE_CATEGORIES } from '@/data/sample';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type AddTransactionContextValue = {
  account: string | null;
  setAccount: Dispatch<SetStateAction<string | null>>;
  amount: number;
  setAmount: Dispatch<SetStateAction<number>>;
  category: string | null;
  setCategory: Dispatch<SetStateAction<string | null>>;
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
  occurredAt: Date;
  setOccurredAt: Dispatch<SetStateAction<Date>>;
};

const AddTransactionContext = createContext<AddTransactionContextValue | null>(null);

export function AddTransactionProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<string | null>(SAMPLE_ACCOUNTS[0].id);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<string | null>(SAMPLE_CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState(() => new Date());

  return (
    <AddTransactionContext.Provider
      value={{
        account,
        setAccount,
        amount,
        setAmount,
        category,
        setCategory,
        note,
        setNote,
        occurredAt,
        setOccurredAt,
      }}
    >
      {children}
    </AddTransactionContext.Provider>
  );
}

export function useAddTransaction() {
  const context = useContext(AddTransactionContext);

  if (!context) {
    throw new Error('useAddTransaction must be used within AddTransactionProvider');
  }

  return context;
}
