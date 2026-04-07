import React from 'react';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from '../src/screens/SplashScreen';

export default function Index() {
  const navigation = useNavigation();
  return <SplashScreen onFinish={() => navigation.replace('Onboarding')} />;
}