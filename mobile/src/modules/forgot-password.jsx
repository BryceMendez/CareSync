import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';

export default function ForgotPassword() {
  const navigation = useNavigation();
  return <ForgotPasswordScreen onBack={() => navigation.replace('Login')} />;
}