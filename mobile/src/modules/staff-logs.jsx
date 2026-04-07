import React from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffLogsScreen from '../src/screens/StaffLogsScreen';

export default function StaffLogs() {
  const navigation = useNavigation();
  return (
    <StaffLogsScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('StaffHome');
        if (tab === 'alerts') navigation.navigate('StaffAlerts');
        if (tab === 'residents') navigation.navigate('StaffResidents');
        if (tab === 'camera') navigation.navigate('StaffCamera');
      }}
    />
  );
}