import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DailyReportScreen from '../src/screens/DailyReportScreen';

export default function DailyReport() {
  const navigation = useNavigation();
  return <DailyReportScreen onBack={() => navigation.goBack()} />;
}