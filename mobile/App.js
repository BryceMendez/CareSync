import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth flow
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import Login from './src/modules/login';
import Register from './src/modules/register';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Family screens
import HomeScreen from './src/screens/HomeScreen';
import FamilyProfileScreen from './src/screens/FamilyProfileScreen';
import FamilyAlertsScreen from './src/screens/FamilyAlertsScreen';
import FamilyCameraScreen from './src/screens/FamilyCameraScreen';
import FamilyReportsScreen from './src/screens/FamilyReportsScreen';
import DailyReportScreen from './src/screens/DailyReportScreen';
import ResidentProfileScreen from './src/screens/ResidentProfileScreen'; // ✅ NEW

// Staff screens
import StaffLogin from './src/modules/staff-login';
import StaffLoginScreen from './src/screens/StaffLoginScreen';
import StaffHomeScreen from './src/screens/StaffHomeScreen';
import StaffRegister from './src/modules/staff-register';
import StaffProfileScreen from './src/screens/StaffProfileScreen';
import StaffAlertsScreen from './src/screens/StaffAlertsScreen';
import StaffCameraScreen from './src/screens/StaffCameraScreen';
import StaffLogsScreen from './src/screens/StaffLogsScreen';
import StaffResidentsScreen from './src/screens/StaffResidentsScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [familyProfile, setFamilyProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    residentName: 'Nora Roberts',
    relationship: 'Mother',
  });

  const [staffProfile, setStaffProfile] = useState({
    name: 'Nurse Sarah Mitchell',
    email: 'sarah.mitchell@caresync.ph',
    employeeId: 'EMP-20412',
    role: 'Registered Nurse',
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >

        {/* ── Auth Flow ── */}
        <Stack.Screen name="Splash">
          {({ navigation }) => (
            <SplashScreen onFinish={() => navigation.replace('Onboarding')} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen onFinish={() => navigation.replace('Login')} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Register">
          {({ navigation }) => (
            <Register
              onRegistered={(profile) => {
                setFamilyProfile(profile);
                navigation.replace('Home');
              }}
              onLogin={() => navigation.replace('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ForgotPassword">
          {({ navigation }) => (
            <ForgotPasswordScreen onBack={() => navigation.replace('Login')} />
          )}
        </Stack.Screen>

        {/* ── Family Screens ── */}
        {/* ✅ UPDATED: added onViewResident */}
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              profile={familyProfile}
              onNavigate={(tab) => {
                if (tab === 'alerts') navigation.navigate('FamilyAlerts');
                if (tab === 'camera') navigation.navigate('FamilyCamera');
                if (tab === 'reports') navigation.navigate('FamilyReports');
                if (tab === 'profile') navigation.navigate('FamilyProfile');
              }}
              onViewResident={() => navigation.navigate('ResidentProfile')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FamilyAlerts">
          {({ navigation }) => (
            <FamilyAlertsScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('Home');
                if (tab === 'camera') navigation.navigate('FamilyCamera');
                if (tab === 'reports') navigation.navigate('FamilyReports');
                if (tab === 'profile') navigation.navigate('FamilyProfile');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FamilyCamera">
          {({ navigation }) => (
            <FamilyCameraScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('Home');
                if (tab === 'alerts') navigation.navigate('FamilyAlerts');
                if (tab === 'reports') navigation.navigate('FamilyReports');
                if (tab === 'profile') navigation.navigate('FamilyProfile');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FamilyReports">
          {({ navigation }) => (
            <FamilyReportsScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('Home');
                if (tab === 'alerts') navigation.navigate('FamilyAlerts');
                if (tab === 'camera') navigation.navigate('FamilyCamera');
                if (tab === 'profile') navigation.navigate('FamilyProfile');
                if (tab === 'daily-report') navigation.navigate('DailyReport');
              }}
            />
          )}
        </Stack.Screen>

        {/* ✅ UPDATED: added onViewResident */}
        <Stack.Screen name="FamilyProfile">
          {({ navigation }) => (
            <FamilyProfileScreen
              profile={familyProfile}
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('Home');
                if (tab === 'alerts') navigation.navigate('FamilyAlerts');
                if (tab === 'camera') navigation.navigate('FamilyCamera');
                if (tab === 'reports') navigation.navigate('FamilyReports');
              }}
              onSignOut={() => navigation.replace('Login')}
              onViewResident={() => navigation.navigate('ResidentProfile')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="DailyReport">
          {({ navigation }) => (
            <DailyReportScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        {/* ✅ NEW: Resident Profile Screen */}
        <Stack.Screen name="ResidentProfile">
          {({ navigation }) => (
            <ResidentProfileScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        {/* ── Staff Screens ── */}
        <Stack.Screen name="StaffLogin" component={StaffLogin} />

        <Stack.Screen name="StaffForgotPassword">
          {({ navigation }) => (
            <ForgotPasswordScreen onBack={() => navigation.replace('StaffLogin')} />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffHome">
          {({ navigation }) => (
            <StaffHomeScreen
              onNavigate={(tab) => {
                if (tab === 'alerts') navigation.navigate('StaffAlerts');
                if (tab === 'residents') navigation.navigate('StaffResidents');
                if (tab === 'camera') navigation.navigate('StaffCamera');
                if (tab === 'logs') navigation.navigate('StaffLogs');
              }}
              onProfile={() => navigation.navigate('StaffProfile')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffRegister">
          {({ navigation }) => (
            <StaffRegister
              onRegistered={(profile) => {
                setStaffProfile((s) => ({ ...s, ...profile }));
                navigation.replace('StaffHome');
              }}
              onLogin={() => navigation.replace('StaffLogin')}
              onBack={() => navigation.replace('StaffLogin')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffAlerts">
          {({ navigation }) => (
            <StaffAlertsScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('StaffHome');
                if (tab === 'residents') navigation.navigate('StaffResidents');
                if (tab === 'camera') navigation.navigate('StaffCamera');
                if (tab === 'logs') navigation.navigate('StaffLogs');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffCamera">
          {({ navigation }) => (
            <StaffCameraScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('StaffHome');
                if (tab === 'alerts') navigation.navigate('StaffAlerts');
                if (tab === 'residents') navigation.navigate('StaffResidents');
                if (tab === 'logs') navigation.navigate('StaffLogs');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffLogs">
          {({ navigation }) => (
            <StaffLogsScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('StaffHome');
                if (tab === 'alerts') navigation.navigate('StaffAlerts');
                if (tab === 'residents') navigation.navigate('StaffResidents');
                if (tab === 'camera') navigation.navigate('StaffCamera');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffResidents">
          {({ navigation }) => (
            <StaffResidentsScreen
              onNavigate={(tab) => {
                if (tab === 'home') navigation.replace('StaffHome');
                if (tab === 'alerts') navigation.navigate('StaffAlerts');
                if (tab === 'camera') navigation.navigate('StaffCamera');
                if (tab === 'logs') navigation.navigate('StaffLogs');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StaffProfile">
          {({ navigation }) => (
            <StaffProfileScreen
              profile={staffProfile}
              onBack={() => navigation.goBack()}
              onSignOut={() => navigation.replace('Login')}
            />
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}