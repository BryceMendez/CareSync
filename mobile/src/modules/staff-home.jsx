import React from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffHomeScreen from '../src/screens/StaffHomeScreen';

export default function StaffHome() {
  const navigation = useNavigation();
  return (
    <StaffHomeScreen
      onNavigate={(tab) => {
        if (tab === 'alerts') navigation.navigate('StaffAlerts');
        if (tab === 'residents') navigation.navigate('StaffResidents');
        if (tab === 'camera') navigation.navigate('StaffCamera');
        if (tab === 'logs') navigation.navigate('StaffLogs');
      }}
    />
  );
}