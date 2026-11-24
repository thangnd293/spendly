import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';

interface BottomActionProps {
  count: number;
  onPress: () => void;
}

export default function BottomAction({ count, onPress }: BottomActionProps) {
  const insets = useSafeAreaInsets();

  const disabled = count === 0;
  return (
    <View className="bg-surface px-4 pt-2" style={{ paddingBottom: insets.bottom }}>
      <Button title={`Thêm vào danh sách (${count})`} disabled={disabled} onPress={onPress} />
    </View>
  );
}
