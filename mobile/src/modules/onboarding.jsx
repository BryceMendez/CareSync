import React from 'react';
import { useNavigation } from '@react-navigation/native';
import OnboardingScreen from '../src/screens/OnboardingScreen';

export default function Onboarding() {
  const navigation = useNavigation();
  return <OnboardingScreen onFinish={() => navigation.replace('Login')} />;
}