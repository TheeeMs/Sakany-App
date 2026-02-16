import { View, Text } from "react-native";

interface BalanceCardProps {
  totalBalance: number;
}

export default function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <View className="items-center py-4">
      <Text className="text-white text-sm opacity-90 mb-2">
        Total Balance Due
      </Text>
      <Text className="text-white text-5xl font-bold">
        {totalBalance.toFixed(2)}$
      </Text>
    </View>
  );
}
