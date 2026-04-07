import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import StaffRegisterScreen from '../screens/StaffRegisterScreen';

export default function StaffRegister({ onRegistered, onLogin, onBack }) {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (fields = {}) => {
    const {
      fullName,
      email,
      password,
      confirm,
      employeeId,
      wing,
      shift,
      onCall,
      escalation,
      photoSelected,
      verificationCode,
      code,
    } = fields;
    setError('');

    // Name
    if (!fullName || !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (fullName.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }

    // Employee ID
    if (!employeeId || !employeeId.trim()) {
      setError('Please enter your Employee ID.');
      return;
    }

    // Wing
    if (!wing || !wing.trim()) {
      setError('Please select your wing assignment.');
      return;
    }

    // Email
    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password
    if (!password || !password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Confirm Password
    if (!confirm || !confirm.trim()) {
      setError('Please confirm your password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    // Verification code check (from step data)
    if (verificationCode && code && verificationCode !== code) {
      setError('Verification code mismatch.');
      return;
    }

    // Password
    if (!password || !password.trim()) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Confirm Password
    if (!confirm || !confirm.trim()) {
      setError('Please confirm your password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const profile = {
        name: fullName.trim(),
        email: email.trim(),
        employeeId: employeeId.trim(),
        role: wing.trim(),
        shift,
        onCall,
        escalation,
      };
      if (typeof onRegistered === 'function') {
        onRegistered(profile);
      } else {
        navigation.replace('StaffHome');
      }
    }, 800);
  };

  return (
    <StaffRegisterScreen
      onComplete={handleRegister}
      onLogin={() => {
        if (typeof onLogin === 'function') {
          onLogin();
        } else {
          navigation.replace('StaffLogin');
        }
      }}
      onBack={() => {
        if (typeof onBack === 'function') {
          onBack();
        } else {
          navigation.replace('StaffLogin');
        }
      }}
      error={error}
      loading={loading}
    />
  );
}