import React from 'react';
import { useRouter } from 'expo-router';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';

export default function ForgotPassword() {
  const router = useRouter();
  return <ForgotPasswordScreen onBack={() => router.replace('/login')} />;
}