import React from 'react';
import { useRouter } from 'expo-router';
import LoginScreen from '../src/screens/LoginScreen';

export default function Login() {
  const router = useRouter();
  return (
    <LoginScreen
      onLogin={() => router.replace('/home')}
      onRegister={() => router.push('/register')}
      onForgotPassword={() => router.push('/forgot-password')}
      onGoogleLogin={() => console.log('Google login')}
      onAppleLogin={() => console.log('Apple login')}
      onStaffPortal={() => router.push('/staff-login')}
    />
  );
}