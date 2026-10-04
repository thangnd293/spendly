import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export type CategoryKind = 'spend' | 'income';

type AddCategoryContextValue = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  parentId: string | null;
  setParentId: Dispatch<SetStateAction<string | null>>;
  icon: string;
  setIcon: Dispatch<SetStateAction<string>>;
  kind: CategoryKind;
  setKind: Dispatch<SetStateAction<CategoryKind>>;
};

const AddCategoryContext = createContext<AddCategoryContextValue | null>(null);

export function AddCategoryProvider({ children }: PropsWithChildren) {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState('icon_1.png');
  const [kind, setKind] = useState<CategoryKind>('spend');

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
