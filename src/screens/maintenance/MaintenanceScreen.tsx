import { View, Text, ScrollView } from "react-native";

export default function MaintenanceScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800">Maintenance</Text>
          <Text className="mt-2 text-gray-600">
            Maintenance screen coming soon...
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
