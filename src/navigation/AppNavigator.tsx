import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  GetStartedScreen,
  LoginScreen,
  PhoneLoginScreen,
  RegisterScreen,
  HomeScreen,
  AboutScreen,
  QRAccessScreen,
  QRHistoryScreen,
  QRScanScreen,
  MissingFoundScreen,
  ReportDetailsScreen,
  CreateReportScreen,
  FeedbackScreen,
  MyPostsScreen,
  PrivateFeedbackScreen,
  CreatePostScreen,
  MaintenanceScreen,
  RequestDetailsScreen,
  OtherRequestScreen,
  MaintenanceHistoryScreen,
  TechnicianJobsScreen,
  TechnicianHistoryScreen,
  TechnicianRequestDetailsScreen,
  PaymentScreen,
  PaymentDetailsScreen,
  PaymentStatisticsScreen,
  ProfileScreen,
  NotificationScreen,
  EventsScreen,
  EventDetailsScreen,
  CreateEventScreen,
} from "../screens";
import type { MissingFoundItem } from "../screens/missing-found/types";
import type { Payment } from "../screens/payment/types";
import { BottomTabBar } from "../components";
import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  PhoneLogin: undefined;
  Register: undefined;
  Main: undefined;
  About: undefined;
  QRAccess: undefined;
  QRHistory: undefined;
  SecurityScan: undefined;
  MissingFound: undefined;
  ReportDetails: { item: MissingFoundItem };
  CreateReport: undefined;
  Feedback: undefined;
  MyPosts: undefined;
  PrivateFeedback: undefined;
  CreatePost: undefined;
  Events: undefined;
  EventDetails: { eventId: string; isJoined?: boolean };
  CreateEvent: undefined;
  RequestDetails: { category?: string } | undefined;
  OtherRequest: { category?: string } | undefined;
  MaintenanceHistory: undefined;
  TechnicianMain: undefined;
  TechnicianRequestDetails: { requestId: string };
  PaymentDetails: { payment: Payment };
  PaymentStatistics: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Maintenance: undefined;
  Payment: undefined;
  Profile: undefined;
};

export type TechnicianTabParamList = {
  TechJobs: undefined;
  TechHistory: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const TechnicianTab = createBottomTabNavigator<TechnicianTabParamList>();

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

function TechnicianTabs() {
  return (
    <TechnicianTab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <TechnicianTab.Screen name="TechJobs" component={TechnicianJobsScreen} />
      <TechnicianTab.Screen
        name="TechHistory"
        component={TechnicianHistoryScreen}
      />
      <TechnicianTab.Screen name="Profile" component={ProfileScreen} />
    </TechnicianTab.Navigator>
  );
}

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role);
  const isSecurityGuard = userRole === "SECURITY_GUARD";
  const isTechnician = userRole === "TECHNICIAN";
  const initialRouteName = !isAuthenticated
    ? "GetStarted"
    : isSecurityGuard
      ? "SecurityScan"
      : isTechnician
        ? "TechnicianMain"
        : "Main";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="GetStarted"
            component={GetStartedScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PhoneLogin"
            component={PhoneLoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : isSecurityGuard ? (
        <>
          <Stack.Screen
            name="SecurityScan"
            component={QRScanScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : isTechnician ? (
        <>
          <Stack.Screen
            name="TechnicianMain"
            component={TechnicianTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TechnicianRequestDetails"
            component={TechnicianRequestDetailsScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
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
            name="EventDetails"
            component={EventDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
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
            name="OtherRequest"
            component={OtherRequestScreen}
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
          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
