import React from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffResidentsScreen from '../src/screens/StaffResidentsScreen';

export default function StaffResidents() {
  const navigation = useNavigation();
  return (
    <StaffResidentsScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('StaffHome');
        if (tab === 'alerts') navigation.navigate('StaffAlerts');
        if (tab === 'camera') navigation.navigate('StaffCamera');
        if (tab === 'logs') navigation.navigate('StaffLogs');
      }}
    />
  );
}
