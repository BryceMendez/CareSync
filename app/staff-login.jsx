import React from 'react';
import { useRouter } from 'expo-router';
import StaffLoginScreen from '../src/screens/StaffLoginScreen';

export default function StaffLogin() {
  const router = useRouter();
  return (
    <StaffLoginScreen
      onLogin={() => router.replace('/staff-home')}
      onRegister={() => router.push('/staff-register')}
      onFamilyPortal={() => router.replace('/login')}
      onForgotPassword={() => router.push('/staff-forgot-password')}
    />
  );
}