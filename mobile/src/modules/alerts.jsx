import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FamilyAlertsScreen from '../src/screens/FamilyAlertsScreen';

export default function Alerts() {
  const navigation = useNavigation();
  return (
    <FamilyAlertsScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('Home');
        if (tab === 'camera') navigation.navigate('FamilyCamera');
        if (tab === 'reports') navigation.navigate('FamilyReports');
        if (tab === 'profile') navigation.navigate('FamilyProfile');
      }}
    />
  );
}