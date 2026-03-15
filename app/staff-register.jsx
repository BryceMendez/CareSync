import React from 'react';
import { useRouter } from 'expo-router';
import StaffRegisterScreen from '../src/screens/StaffRegisterScreen';

export default function StaffRegister() {
  const router = useRouter();
  return (
    <StaffRegisterScreen
      onComplete={() => router.replace('/staff-home')}
      onLogin={() => router.replace('/staff-login')}
      onBack={() => router.replace('/staff-login')}
    />
  );
}