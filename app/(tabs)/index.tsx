import TransactionGroupByDate from "@/components/TransactionGroupByDate";
import { VStack } from "@/components/ui/vstack";
import { groupedTransaction } from "@/data/sample";
import { FlatList, View } from "react-native";

export default function HomeScreen() {
  return (
    <VStack className="px-3 py-2">
      <FlatList
        data={groupedTransaction}
        ItemSeparatorComponent={() => <View className="h-6" />}
        renderItem={({ item }) => (
          <TransactionGroupByDate
            date={item.date}
            totalAmount={item.totalAmountVnd}
            transactions={item.transactions}
          />
        )}
        keyExtractor={(item) => item.date}
      />
    </VStack>
  );
}
