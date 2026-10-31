import { View } from 'react-native';

import { Divider, Image, Text } from '@/components/ui';
import { Category } from '@/data/category';
import { iconName, iconSource } from '@/utils/icons';
import { SelectionOption } from './SelectionOption';

export type CategorySectionData = Category & { children: Category[] };

type CategorySectionProps = {
  section: CategorySectionData;
  selectedId: string | null;
  onPick: (id: string) => void;
};

export function CategorySection({ section, selectedId, onPick }: CategorySectionProps) {
  return (
    <View className="overflow-hidden rounded-3xl bg-surface">
      <SelectionOption
        selected={selectedId === section.id}
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
            selected={selectedId === child.id}
            onPress={() => onPick(child.id)}
          >
            <Text>{child.name}</Text>
          </SelectionOption>
          {index < section.children.length - 1 && <Divider className="ml-20" />}
        </View>
      ))}
    </View>
  );
}
