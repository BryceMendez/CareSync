import React from 'react';
import { useRouter } from 'expo-router';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';

export default function StaffForgotPassword() {
  const router = useRouter();
  return <ForgotPasswordScreen onBack={() => router.replace('/staff-login')} />;
}