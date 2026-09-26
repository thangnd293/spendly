import {
  Tabs,
  TabsContent,
  TabsContentWrapper,
  TabsIndicator,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from "@/components/ui";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import { Text, View } from "react-native";

export default function AddTransactionScreen() {
  return (
    <View className="bg-background p-6">
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      <Text>Add Transaction</Text>
    </View>
  );
}
