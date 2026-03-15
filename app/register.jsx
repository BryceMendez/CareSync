import React from 'react';
import { useRouter } from 'expo-router';
import RegisterScreen from '../src/screens/RegisterScreen';

export default function Register() {
  const router = useRouter();
  return (
    <RegisterScreen
      onComplete={() => router.replace('/home')}
      onLogin={() => router.replace('/login')}
    />
  );
}