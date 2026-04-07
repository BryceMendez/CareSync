import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from '../screens/RegisterScreen';

export default function Register({ onRegistered, onLogin }) {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (fields = {}) => {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
      residentName,
      relationship,
      linked,
      accessCode,
      code,
    } = fields;

    const name = [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
    const effectiveResidentName = linked?.name || residentName;

    setError('');

    // Name
    if (!name) {
      setError('Please enter your full name.');
      return;
    }
    if (name.length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }

    // Resident name
    if (!effectiveResidentName || !effectiveResidentName.trim()) {
      setError('Please enter the resident\'s name.');
      return;
    }

    // Relationship
    if (!relationship || !relationship.trim()) {
      setError('Please enter your relationship to the resident.');
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
    if (!confirmPassword || !confirmPassword.trim()) {
      setError('Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Access code (optional, just not empty in this flow)
    if (!accessCode || !accessCode.trim()) {
      setError('Please enter the access code.');
      return;
    }

    if (!code || !code.trim()) {
      setError('Verification code is required.');
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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const profile = {
        name: name.trim(),
        email: email.trim(),
        residentName: effectiveResidentName.trim(),
        relationship: relationship.trim(),
      };
      if (typeof onRegistered === 'function') {
        onRegistered(profile);
      } else {
        navigation.replace('Home');
      }
    }, 800);
  };

  return (
    <RegisterScreen
      onComplete={handleRegister}
      onLogin={() => {
        if (typeof onLogin === 'function') {
          onLogin();
        } else {
          navigation.replace('Login');
        }
      }}
      error={error}
      loading={loading}
    />
  );
}