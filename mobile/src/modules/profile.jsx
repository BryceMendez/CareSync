import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FamilyProfileScreen from '../src/screens/FamilyProfileScreen';

export default function Profile() {
  const navigation = useNavigation();
  return (
    <FamilyProfileScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.navigate('Home');
        if (tab === 'alerts') navigation.navigate('FamilyAlerts');
        if (tab === 'camera') navigation.navigate('FamilyCamera');
        if (tab === 'reports') navigation.navigate('FamilyReports');
      }}
      onSignOut={() => navigation.replace('Login')}
    />
  );
}