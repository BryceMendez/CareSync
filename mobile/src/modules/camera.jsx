import React from 'react';
import { useNavigation } from '@react-navigation/native';
import FamilyCameraScreen from '../src/screens/FamilyCameraScreen';

export default function Camera() {
  const navigation = useNavigation();
  return (
    <FamilyCameraScreen
      onNavigate={(tab) => {
        if (tab === 'home') navigation.replace('Home');
        if (tab === 'alerts') navigation.navigate('FamilyAlerts');
        if (tab === 'reports') navigation.navigate('FamilyReports');
        if (tab === 'profile') navigation.navigate('FamilyProfile');
      }}
    />
  );
}