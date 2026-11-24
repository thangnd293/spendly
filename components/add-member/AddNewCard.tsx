import { Pressable } from 'react-native';
import { ChevronRight, UserPlus } from 'lucide-react-native';

import { Center, HStack, Text, VStack } from '@/components/ui';
import useColors from '@/hooks/useColors';

interface AddNewCardProps {
  onPress: () => void;
}

export default function AddNewCard({ onPress }: AddNewCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Thêm người mới"
      className="mt-2 rounded-3xl bg-green-50 p-4"
    >
      <HStack className="items-center" space="md">
        <Center className="size-14 rounded-full bg-green-100">
          <UserPlus size={26} color={colors.primary} />
        </Center>
        <VStack className="flex-1">
          <Text size="lg" bold className="text-primary">
            Thêm người mới
          </Text>
          <Text size="sm" className="text-muted">
            Nhập tên và thêm vào danh sách
          </Text>
        </VStack>
        <ChevronRight size={22} color={colors.muted} />
      </HStack>
    </Pressable>
  );
}
