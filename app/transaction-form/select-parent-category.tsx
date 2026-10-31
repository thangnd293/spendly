import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { SelectionOption } from '@/components/transaction-form';
import { useAddCategory } from '@/components/transaction-form/AddCategoryContext';
import { Image, Text } from '@/components/ui';
import { iconName, iconSource } from '@/utils/icons';
import { useDbQuery } from '@/hooks/useDbQuery';
import { Category, listParentCategories } from '@/data/category';

export default function SelectParentCategoryScreen() {
  const { parentId, setParentId, kind } = useAddCategory();

  const { data: parentCategories } = useDbQuery<Category[]>(
    (db) => listParentCategories(db, kind),
    [kind],
    [],
  );

  function onCategoryPress(id: string) {
    setParentId(id);
    router.back();
  }

  return (
    <ScrollView contentContainerClassName="gap-2 px-4 py-2">
      {parentCategories.map(({ id, icon, name }) => (
        <SelectionOption
          key={id}
          selected={parentId === id}
          leading={<Image size="sm" source={iconSource(icon)} alt={iconName(icon)} />}
          onPress={() => onCategoryPress(id)}
        >
          <Text>{name}</Text>
        </SelectionOption>
      ))}
    </ScrollView>
  );
}
