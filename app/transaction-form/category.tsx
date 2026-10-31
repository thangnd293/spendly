import { router } from 'expo-router';
import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  CategorySection,
  CategorySectionData,
  useDraftTransaction,
} from '@/components/transaction-form';
import { Button, RadioGroup } from '@/components/ui';
import { Category, CategoryKind, listCategories } from '@/data/category';
import useColors from '@/hooks/useColors';
import { useDbQuery } from '@/hooks/useDbQuery';

function sectionOf(categories: Category[]): CategorySectionData[] {
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
          <CategorySection
            key={section.id}
            section={section}
            selectedId={draft.category}
            onPick={onPick}
          />
        ))}
      </ScrollView>
    </View>
  );
}
