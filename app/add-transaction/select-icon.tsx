import { router } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAddCategory } from '@/components/add-transaction/AddCategoryContext';
import { Image } from '@/components/ui';
import { fileName, iconKeys, iconSource } from '@/utils/icons';

export default function SelectIconScreen() {
  const insets = useSafeAreaInsets();
  const { setIcon } = useAddCategory();

  function onIconPress(icon: string) {
    setIcon(fileName(icon));
    router.back();
  }

  return (
    <View className="pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
      <FlatList
        data={iconKeys}
        numColumns={6}
        keyExtractor={(key) => key}
        renderItem={({ item }) => (
          <Pressable className="w-1/6 items-center py-3" onPress={() => onIconPress(item)}>
            <Image
              className="size-10 rounded-full"
              source={iconSource(item)}
              alt={fileName(item)}
            />
          </Pressable>
        )}
      />
    </View>
  );
}
