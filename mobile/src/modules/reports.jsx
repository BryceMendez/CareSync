import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FamilyReportsScreen from '../src/screens/FamilyReportsScreen';

export default function Reports() {
  const navigation = useNavigation();
  return (
    <FamilyReportsScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.navigate('Home');
        if (tab === 'alerts') navigation.navigate('FamilyAlerts');
        if (tab === 'camera') navigation.navigate('FamilyCamera');
        if (tab === 'profile') navigation.navigate('FamilyProfile');
        if (tab === 'daily-report') navigation.navigate('DailyReport');
      }}
    />
  );
}