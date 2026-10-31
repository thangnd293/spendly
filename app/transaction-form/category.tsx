import { router } from 'expo-router';
import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { SelectionOption, useDraftTransaction } from '@/components/transaction-form';
import { Button, Divider, Image, RadioGroup, Text } from '@/components/ui';
import { Category, CategoryKind, listCategories } from '@/data/category';
import useColors from '@/hooks/useColors';
import { useDbQuery } from '@/hooks/useDbQuery';
import { iconName, iconSource } from '@/utils/icons';

type Section = Category & { children: Category[] };

function sectionOf(categories: Category[]): Section[] {
  return categories
    .filter((category) => category.parentId === null)
    .map((category) => ({
      ...category,
      children: categories.filter((child) => child.parentId === category.id),
    }));
}

export default function CategoryScreen() {
  const colors = useColors();
  const draft = useDraftTransaction();
  const [kind, setKind] = useState<CategoryKind>(draft.kind);
  const { data: categories } = useDbQuery((db) => listCategories(db, kind), [kind], []);

  function onPick(id: string) {
    draft.setCategory(id);
    draft.setKind(kind);
    router.back();
  }

  const sections = sectionOf(categories);

  return (
    <View className="flex-1 bg-background pt-4">
      <RadioGroup
        className="mx-6 mb-4 rounded-full bg-black/10"
        itemClassName="w-1/2"
        value={kind}
        items={[
          { value: 'spend', label: 'Khoản chi' },
          { value: 'income', label: 'Khoản thu' },
        ]}
        onValueChange={setKind}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 mx-6"
        keyboardShouldPersistTaps="handled"
      >
        <Button
          variant="secondary"
          icon={<CirclePlus size={18} color={colors.primary} />}
          title="Nhóm mới"
          onPress={() => router.push('/transaction-form/add-category')}
        />
        {sections.map((section) => (
          <View key={section.id} className="overflow-hidden rounded-3xl bg-surface">
            <SelectionOption
              selected={draft.category === section.id}
              leading={
                <Image size="sm" source={iconSource(section.icon)} alt={iconName(section.icon)} />
              }
              onPress={() => onPick(section.id)}
            >
              <Text>{section.name}</Text>
            </SelectionOption>
            {section.children.map((child, index) => (
              <View key={child.id}>
                <SelectionOption
                  layout="branch"
                  leading={
                    <Image
                      className="ml-2"
                      size="xs"
                      source={iconSource(child.icon)}
                      alt={iconName(child.icon)}
                    />
                  }
                  selected={draft.category === child.id}
                  onPress={() => onPick(child.id)}
                >
                  <Text>{child.name}</Text>
                </SelectionOption>
                {index < section.children.length - 1 && <Divider className="ml-20" />}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
