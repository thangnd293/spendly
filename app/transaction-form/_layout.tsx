import { router, Stack } from 'expo-router';
import { Button, Platform } from 'react-native';

import { AddCategoryProvider } from '@/components/transaction-form/AddCategoryContext';
import useColors from '@/hooks/useColors';

export default function TransactionFormLayout() {
  const colors = useColors();

  return (
    <AddCategoryProvider>
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerTransparent: false,
        }}
      >
        <Stack.Screen
          name="add"
          options={{
            title: 'Thêm Giao Dịch',
            headerLeft:
              Platform.OS === 'ios'
                ? () => (
                    <Button title="Hủy" color={colors.foreground} onPress={() => router.back()} />
                  )
                : undefined,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            title: 'Chọn Ví',
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: 'Sửa giao dịch',
          }}
        />
        <Stack.Screen
          name="category"
          options={{
            title: 'Chọn Nhóm',
          }}
        />

        <Stack.Screen
          name="note"
          options={{
            title: 'Ghi Chú',
          }}
        />
        <Stack.Screen
          name="add-member"
          options={{
            title: 'Thêm thành viên',
          }}
        />

        <Stack.Screen
          name="add-new-person"
          options={{
            title: 'Thêm người mới',
          }}
        />

        <Stack.Screen
          name="add-category"
          options={{
            title: 'Nhóm mới',
          }}
        />
        <Stack.Screen
          name="select-icon"
          options={{
            title: 'Chọn biểu tượng',
          }}
        />
        <Stack.Screen
          name="select-parent-category"
          options={{
            title: 'Chọn nhóm',
          }}
        />
      </Stack>
    </AddCategoryProvider>
  );
}
