import React from 'react';
import { useRouter } from 'expo-router';
import StaffResidentsScreen from '../src/screens/StaffResidentsScreen';

export default function StaffResidents() {
  const router = useRouter();
  return (
    <StaffResidentsScreen
      onNavigate={(tab) => {
        if (tab === 'home') router.replace('/staff-home');
        if (tab === 'alerts') router.push('/staff-alerts');
        if (tab === 'camera') router.push('/staff-camera');
        if (tab === 'logs') router.push('/staff-logs');
      }}
    />
  );
}