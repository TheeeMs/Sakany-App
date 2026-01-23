import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  AboutScreen,
  QRAccessScreen,
  QRHistoryScreen,
} from "../screens";

export type RootStackParamList = {
  Home: undefined;
  About: undefined;
  QRAccess: undefined;
  QRHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
      <Stack.Screen
        name="QRAccess"
        component={QRAccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QRHistory"
        component={QRHistoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
