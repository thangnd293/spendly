import { Pressable, View } from 'react-native';

import { Checkbox, Divider, HStack, Text, VStack } from '@/components/ui';
import { Person } from '@/data/person';
import Avatar from '../ui/Avatar';

const AVATAR_SIZE = 52;
const ITEM_GAP = 16;
const ITEM_PADDING_X = 12;

interface SelectableItemProps {
  person: Person;
  selected: boolean;
  onToggle: () => void;
  showDivider: boolean;
}

export default function SelectableItem({
  person,
  selected,
  onToggle,
  showDivider,
}: SelectableItemProps) {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityLabel={person.name}
        accessibilityState={{ checked: selected }}
        className="py-3"
        style={{ paddingHorizontal: ITEM_PADDING_X }}
      >
        <HStack className="items-center" style={{ gap: ITEM_GAP }}>
          <Avatar name={person.name} uri={person.avatarUrl} />

          <VStack className="flex-1">
            <Text size="lg" numberOfLines={1}>
              {person.name}
            </Text>
            {selected ? (
              <Text size="sm" className="text-muted">
                Đã chọn
              </Text>
            ) : null}
          </VStack>

          <View pointerEvents="none">
            <Checkbox checked={selected} />
          </View>
        </HStack>
      </Pressable>

      {showDivider ? (
        <Divider style={{ marginLeft: ITEM_PADDING_X + AVATAR_SIZE + ITEM_GAP }} />
      ) : null}
    </View>
  );
}
