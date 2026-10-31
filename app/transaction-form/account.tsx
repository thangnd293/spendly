import { router } from 'expo-router';

import { SelectionOption } from '@/components/transaction-form';
import { useDraftTransaction } from '@/components/transaction-form/DraftTransactionContext';
import { Image, Text, VStack } from '@/components/ui';
import { listActiveAccounts } from '@/data/account';
import { useDbQuery } from '@/hooks/useDbQuery';
import { iconName, iconSource } from '@/utils/icons';
import { formatMoney } from '@/utils/money';

export default function AccountScreen() {
  const { account: selectedAccount, setAccount } = useDraftTransaction();
  const { data: accounts } = useDbQuery((db) => listActiveAccounts(db), [], []);

  function onAccountPress(accountId: string) {
    setAccount(accountId);
    router.back();
  }

  return (
    <VStack space="lg" className="p-6">
      {accounts.map(({ id, icon, name, openingBalanceVnd }) => (
        <SelectionOption
          key={id}
          leading={<Image size="xs" source={iconSource(icon)} alt={iconName(icon)} />}
          selected={selectedAccount === id}
          onPress={() => onAccountPress(id)}
        >
          <VStack>
            <Text bold>{name}</Text>
            <Text>{formatMoney(openingBalanceVnd)} ₫</Text>
          </VStack>
        </SelectionOption>
      ))}
    </VStack>
  );
}
