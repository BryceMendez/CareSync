import React from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffCameraScreen from '../src/screens/StaffCameraScreen';

export default function StaffCamera() {
  const navigation = useNavigation();
  return (
    <StaffCameraScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('StaffHome');
        if (tab === 'alerts') navigation.navigate('StaffAlerts');
        if (tab === 'residents') navigation.navigate('StaffResidents');
        if (tab === 'logs') navigation.navigate('StaffLogs');
      }}
    />
  );
}
