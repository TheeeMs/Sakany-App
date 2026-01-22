import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-[28px] font-bold text-[#333] mb-[30px]">
        Welcome to Sakany! 🏠
      </Text>

      <TouchableOpacity
        className="bg-[#0D9488] flex-row items-center px-[30px] py-[15px] rounded-[10px] mb-4"
        onPress={() => navigation.navigate("QRAccess")}
      >
        <MaterialCommunityIcons name="qrcode" size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-2">
          QR Access
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-black px-[30px] py-[15px] rounded-[10px]"
        onPress={() => navigation.navigate("About")}
      >
        <Text className="text-white text-base font-semibold">About Us</Text>
      </TouchableOpacity>
    </View>
  );
}
