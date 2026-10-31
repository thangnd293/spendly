import { CategoryKind } from '@/data/category';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type AddCategoryContextValue = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  parentId: string | null;
  setParentId: Dispatch<SetStateAction<string | null>>;
  icon: string;
  setIcon: Dispatch<SetStateAction<string>>;
  reset: () => void;
  kind: CategoryKind;
  setKind: Dispatch<SetStateAction<CategoryKind>>;
};

const AddCategoryContext = createContext<AddCategoryContextValue | null>(null);

export function AddCategoryProvider({ children }: PropsWithChildren) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState('icon_1.png');
  const [kind, setKind] = useState<CategoryKind>('spend');

  function reset() {
    setName('');
    setParentId(null);
    setIcon('icon_1.png');
    setKind('spend');
  }

  return (
    <AddCategoryContext.Provider
      value={{
        name,
        setName,
        parentId,
        setParentId,
        icon,
        setIcon,
        kind,
        setKind,
        reset,
      }}
    >
      {children}
    </AddCategoryContext.Provider>
  );
}

export function useAddCategory() {
  const context = useContext(AddCategoryContext);

  if (!context) {
    throw new Error('useAddCategory must be used within AddCategoryProvider');
  }

  return context;
}
