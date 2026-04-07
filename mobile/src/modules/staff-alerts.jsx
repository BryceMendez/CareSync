import React from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffAlertsScreen from '../src/screens/StaffAlertsScreen';

export default function StaffAlerts() {
  const navigation = useNavigation();
  return (
    <StaffAlertsScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('StaffHome');
        if (tab === 'residents') navigation.navigate('StaffResidents');
        if (tab === 'camera') navigation.navigate('StaffCamera');
        if (tab === 'logs') navigation.navigate('StaffLogs');
      }}
    />
  );
}