import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { SelectionOption } from '@/components/add-transaction';
import { useAddCategory } from '@/components/add-transaction/AddCategoryContext';
import { Image, Text } from '@/components/ui';
import { PARENT_CATEGORIES } from '@/data/sample';
import { iconName, iconSource } from '@/utils/icons';

export default function SelectCategoryScreen() {
  const { parentId, setParentId } = useAddCategory();

  function onCategoryPress(id: string) {
    setParentId(id);
    router.back();
  }

  return (
    <ScrollView contentContainerClassName="gap-2 px-4 py-2">
      {PARENT_CATEGORIES.map(({ id, icon, name }) => (
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
