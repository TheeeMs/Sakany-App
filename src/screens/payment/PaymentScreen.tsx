import { View, Text, ScrollView } from "react-native";
import { AppBottomNav } from "../../components/navigation";

export default function PaymentScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800">Payment</Text>
          <Text className="mt-2 text-gray-600">
            Payment screen coming soon...
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <AppBottomNav />
    </View>
  );
}
