import React from 'react';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../src/screens/HomeScreen';

export default function Home() {
  const navigation = useNavigation();
  return (
    <HomeScreen
      onNavigate={(tab) => {
        if (tab === 'alerts') navigation.navigate('FamilyAlerts');
        if (tab === 'camera') navigation.navigate('FamilyCamera');
        if (tab === 'reports') navigation.navigate('FamilyReports');
        if (tab === 'profile') navigation.navigate('FamilyProfile');
      }}
    />
  );
}