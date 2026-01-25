import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
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
  RequestDetailsScreen,
  MaintenanceHistoryScreen,
  PaymentScreen,
  ProfileScreen,
  OnboardingScreen,
} from "../screens";
import type { MissingFoundItem } from "../screens/missing-found/types";
import { BottomTabBar } from "../components";
import { useAppStore } from "../store";

export type RootStackParamList = {
  Main: undefined;
  About: undefined;
  QRAccess: undefined;
  QRHistory: undefined;
  MissingFound: undefined;
  ReportDetails: { item: MissingFoundItem };
  RequestDetails: { category: string };
  MaintenanceHistory: undefined;
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

function MainNavigator() {
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
        name="RequestDetails"
        component={RequestDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MaintenanceHistory"
        component={MaintenanceHistoryScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const {
    isLoading,
    showOnboarding,
    checkOnboardingStatus,
    completeOnboarding,
  } = useAppStore();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A996" />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return <MainNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF8F3",
  },
});
