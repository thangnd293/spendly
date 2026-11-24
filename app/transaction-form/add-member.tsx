import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';

import AddNewCard from '@/components/add-member/AddNewCard';
import BottomAction from '@/components/add-member/BottomAction';
import SearchBar from '@/components/add-member/SearchBar';
import SelectableItem from '@/components/add-member/SelectableItem';
import { Text } from '@/components/ui';
import { listPeople } from '@/data/person';
import { useDbQuery } from '@/hooks/useDbQuery';
import { normalize } from '@/utils/common';
import { useDraftTransaction } from '@/components/transaction-form';

export default function AddRecipientScreen() {
  const router = useRouter();
  const { setParticipants } = useDraftTransaction();
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: people, loading } = useDbQuery((db) => listPeople(db), [], []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return people;
    return people.filter((p) => normalize(p.name).includes(q));
  }, [people, query]);

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleConfirm = () => {
    setParticipants(selectedIds);
    router.back();
  };

  const handleAddNew = () => {
    router.push('/transaction-form/add-new-person');
  };

  return (
    <View className="flex-1">
      <SearchBar value={query} onChangeText={setQuery} />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <FlatList
            className="m-4"
            contentContainerClassName="bg-surface rounded-3xl p-4"
            data={filtered}
            keyExtractor={(p) => p.id}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <SelectableItem
                person={item}
                selected={selectedIds.includes(item.id)}
                onToggle={() => toggle(item.id)}
                showDivider={index !== filtered.length - 1}
              />
            )}
            ListFooterComponent={<AddNewCard onPress={handleAddNew} />}
            ListEmptyComponent={<Text className="text-indigo-300">Không tìm thấy kết quả</Text>}
          />

          <BottomAction count={selectedIds.length} onPress={handleConfirm} />
        </>
      )}
    </View>
  );
}
