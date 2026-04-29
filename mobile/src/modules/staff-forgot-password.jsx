import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ForgotPasswordScreen from '../src/screens/ForgotPasswordScreen';

export default function StaffForgotPassword() {
  const navigation = useNavigation();
  return <ForgotPasswordScreen onBack={() => navigation.replace('StaffLogin')} />;
}