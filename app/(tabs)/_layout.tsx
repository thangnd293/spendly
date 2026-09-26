import { Center } from "@/components/ui/center";
import colors from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme].accent,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tổng quan",
          tabBarLabel: "Tổng quan",
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Sổ giao dịch",
          tabBarLabel: "Sổ giao dịch",
        }}
      />
      <Tabs.Screen
        name="compose"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarButton: () => <AddTransactionButton />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Ngân sách",
          tabBarLabel: "Ngân sách",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarLabel: "Tài khoản",
        }}
      />
    </Tabs>
  );
}

function AddTransactionButton() {
  const onAddTransaction = () => router.push("/add-transaction");

  return (
    <Center>
      <Pressable
        className="bg-primary size-14 rounded-full justify-center items-center -mt-3"
        onPress={onAddTransaction}
      >
        <Text className="text-3xl text-white">+</Text>
      </Pressable>
    </Center>
  );
}
