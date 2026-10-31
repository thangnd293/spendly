import { Button } from '@/components/ui';
import { VStack } from '@/components/ui/VStack';
import { deleteDatabaseAsync, useSQLiteContext } from 'expo-sqlite';

export default function HomeScreen() {
  const db = useSQLiteContext();

  async function dropDb() {
    await db.closeAsync();
    await deleteDatabaseAsync('spendly.db');
  }

  return (
    <VStack className="px-3 py-2">
      <Button title="Drop DB" onPress={dropDb} />
    </VStack>
  );
}
