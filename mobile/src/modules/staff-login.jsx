import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffLoginScreen from '../screens/StaffLoginScreen';

// ─── Hardcoded Staff Accounts ────────────────────────────────────────────────
const STAFF_ACCOUNTS = [
  { email: 'sarah@caresync.ph', password: 'staff123', name: 'Nurse Sarah', role: 'Registered Nurse' },
  { email: 'john@caresync.ph', password: 'staff456', name: 'Nurse John', role: 'Senior Nurse' },
];

export default function StaffLogin() {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (email, password) => {
    setError('');

    // Validation
    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || !password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const account = STAFF_ACCOUNTS.find(
        (a) =>
          a.email.toLowerCase() === email.trim().toLowerCase() &&
          a.password === password
      );

      if (account) {
        setLoading(false);
        navigation.replace('StaffHome');
      } else {
        setLoading(false);
        setError('Incorrect email or password. Please try again.');
      }
    }, 800);
  };

  return (
    <StaffLoginScreen
      onLogin={handleLogin}
      onRegister={() => navigation.navigate('StaffRegister')}
      onFamilyPortal={() => navigation.replace('Login')}
      onForgotPassword={() => navigation.navigate('StaffForgotPassword')}
      error={error}
      loading={loading}
    />
  );
}