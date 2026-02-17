import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeScreen,
  AboutScreen,
  QRAccessScreen,
  QRHistoryScreen,
  MissingFoundScreen,
  ReportDetailsScreen,
  CreateReportScreen,
  FeedbackScreen,
  MyPostsScreen,
  PrivateFeedbackScreen,
  CreatePostScreen,
  MaintenanceScreen,
  RequestDetailsScreen,
  MaintenanceHistoryScreen,
  PaymentScreen,
  PaymentDetailsScreen,
  PaymentStatisticsScreen,
  ProfileScreen,
  EventsScreen,
} from "../screens";
import type { MissingFoundItem } from "../screens/missing-found/types";
import type { Payment } from "../screens/payment/types";
import { BottomTabBar } from "../components";

export type RootStackParamList = {
  Main: undefined;
  About: undefined;
  QRAccess: undefined;
  QRHistory: undefined;
  MissingFound: undefined;
  ReportDetails: { item: MissingFoundItem };
  CreateReport: undefined;
  Feedback: undefined;
  MyPosts: undefined;
  PrivateFeedback: undefined;
  CreatePost: undefined;
  Events: undefined;
  RequestDetails: { category: string };
  MaintenanceHistory: undefined;
  PaymentDetails: { payment: Payment };
  PaymentStatistics: undefined;
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
      <Stack.Screen
        name="CreateReport"
        component={CreateReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyPosts"
        component={MyPostsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivateFeedback"
        component={PrivateFeedbackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MaintenanceHistory"
        component={MaintenanceHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentDetails"
        component={PaymentDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentStatistics"
        component={PaymentStatisticsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
