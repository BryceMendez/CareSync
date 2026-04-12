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

    // Validations
    if (!name || name.length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // This is the REAL part that talks to your Database
    fetch('http://192.168.1.8:8000/api/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email.trim(),
        password: password,
        resident_name: effectiveResidentName,
        relationship: relationship,
      }),
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    })
    .then(data => {
      setLoading(false);
      console.log('Success! User saved in Database');
      // If your app uses a function to handle login state, call it
      if (typeof onRegistered === 'function') {
        onRegistered(data.user);
      } else {
        navigation.replace('Home');
      }
    })
    .catch(err => {
      setLoading(false);
      setError(err.message || 'Could not connect to server.');
      console.error(err);
    });
  };

  // THIS PART WAS MISSING:
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