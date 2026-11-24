import { router, Tabs } from 'expo-router';
import { Banknote, House, Plus, UserRound, Wallet } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Center } from '@/components/ui/Center';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tổng quan',
          tabBarLabel: 'Tổng quan',
          tabBarIcon: () => <House />,
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          title: 'Sổ giao dịch',
          tabBarLabel: 'Sổ giao dịch',
          tabBarIcon: () => <Wallet />,
        }}
      />
      <Tabs.Screen
        name="compose"
        options={{
          title: '',
          tabBarLabel: () => null,
          tabBarButton: () => <AddTransactionButton />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Ngân sách',
          tabBarLabel: 'Ngân sách',
          tabBarIcon: () => <Banknote />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Tài khoản',
          tabBarLabel: 'Tài khoản',
          tabBarIcon: () => <UserRound />,
        }}
      />
    </Tabs>
  );
}

function AddTransactionButton() {
  const onAddTransaction = () => router.push('/transaction-form/add');

  return (
    <Center>
      <Pressable
        className="-mt-3 size-14 items-center justify-center rounded-full bg-primary"
        onPress={onAddTransaction}
      >
        <Plus color="white" />
      </Pressable>
    </Center>
  );
}
