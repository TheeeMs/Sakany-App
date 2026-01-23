import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeScreen,
  AboutScreen,
  QRAccessScreen,
  QRHistoryScreen,
  MissingFoundScreen,
  ReportDetailsScreen,
  MaintenanceScreen,
  PaymentScreen,
  ProfileScreen,
} from "../screens";
import type { MissingFoundItem } from "../screens/missing-found/types";
import { BottomTabBar } from "../components";

export type RootStackParamList = {
  Main: undefined;
  About: undefined;
  QRAccess: undefined;
  QRHistory: undefined;
  MissingFound: undefined;
  ReportDetails: { item: MissingFoundItem };
};

export type MainTabParamList = {
  Home: undefined;
  Maintenance: undefined;
  Payment: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={MainTabs}
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
      <Stack.Screen
        name="MissingFound"
        component={MissingFoundScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportDetails"
        component={ReportDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
