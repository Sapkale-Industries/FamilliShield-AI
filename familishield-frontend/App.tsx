// App.tsx – handles navigation, bottom tabs, stack, and placeholder screens
import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';

// ---------- Design Tokens (for tab bar and placeholders) ----------
const COLORS = {
  bg: '#F0F4FF',
  white: '#FFFFFF',
  primary: '#2563EB',
  textSecondary: '#7A8BAE',
};

// ---------- MINIMAL PLACEHOLDER SCREENS (all functional) ----------
const AssistantScreen = ({ navigation }) => <Placeholder title="AI Assistant" desc="Ask anything about scams." navigation={navigation} />;
const QRScannerScreen = ({ navigation }) => <Placeholder title="Scan QR Code" desc="Point camera at any QR code to verify safety." navigation={navigation} />;
const FamilyScreen = ({ navigation }) => <Placeholder title="Family Protection" desc="Manage members and protection status." navigation={navigation} />;
const EmergencyScreen = ({ navigation }) => <Placeholder title="Emergency Center" desc="Call 1930 • Report fraud • Save evidence" navigation={navigation} />;
const PremiumScreen = ({ navigation }) => <Placeholder title="Premium" desc="Unlock advanced AI protection." navigation={navigation} />;
const ScamAlertDetailsScreen = ({ navigation }) => <Placeholder title="Scam Alert Details" desc="Detailed info about the trending scam." navigation={navigation} />;
const ActivityHistoryScreen = ({ navigation }) => <Placeholder title="Activity History" desc="All past scans and alerts." navigation={navigation} />;
const ProfileScreen = ({ navigation }) => <Placeholder title="Profile" desc="Your stats, subscription, and settings." navigation={navigation} />;
const NotificationsScreen = ({ navigation }) => <Placeholder title="Notifications" desc="You have no new alerts." navigation={navigation} />;
const AddMemberScreen = ({ navigation }) => <Placeholder title="Add Family Member" desc="Invite via email or share a code." navigation={navigation} />;
const AboutFamilyShieldScreen = ({ navigation }) => <Placeholder title="About FamilyShield AI" desc="Our mission is to protect Indian families from digital scams using AI that is simple, trustworthy, and always free for essential protection." navigation={navigation} />;

const Placeholder = ({ title, desc, navigation }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.primary, marginBottom: 12 }}>{title}</Text>
    <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 }}>{desc}</Text>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 12, backgroundColor: COLORS.white, borderRadius: 20 }}>
      <Text>← Go Back</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

// ---------- BOTTOM NAVIGATION ----------
const Tab = createBottomTabNavigator();
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'AI') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          else if (route.name === 'Family') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'SOS') iconName = focused ? 'warning' : 'warning-outline';
          else iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 8 } }),
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI" component={AssistantScreen} />
      <Tab.Screen name="Family" component={FamilyScreen} />
      <Tab.Screen name="SOS" component={EmergencyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ---------- ROOT STACK NAVIGATOR ----------
const Stack = createNativeStackNavigator();
function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="Assistant" component={AssistantScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Family" component={FamilyScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="ScamAlertDetails" component={ScamAlertDetailsScreen} />
      <Stack.Screen name="ActivityHistory" component={ActivityHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} />
      <Stack.Screen name="AboutFamilyShield" component={AboutFamilyShieldScreen} />
    </Stack.Navigator>
  );
}

// ---------- APP ENTRY ----------
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}