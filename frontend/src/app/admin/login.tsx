
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { loginAdmin } from '@/services/admin.service';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Enter your admin email and password.');
      return;
    }

    if (!loginAdmin(email, password)) {
      setError('Invalid admin email or password.');
      return;
    }

    navigate(ROUTES.admin.dashboard, { replace: true });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={30} color="#2563EB" />
        </View>

        <Text style={styles.brand}>SUBIDHA</Text>
        <Text style={styles.title}>Admin sign in</Text>
        <Text style={styles.subtitle}>
          Sign in to manage rider applications.
        </Text>

        <Text style={styles.label}>Admin email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter admin email"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
          accessibilityLabel="Admin email"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
          accessibilityLabel="Admin password"
          onSubmitEditing={handleLogin}
        />

        {error ? (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>

        <Text style={styles.demoNote}>
          Local demo credentials
        </Text>
        <Text style={styles.demoCredentials}>
          admin@subidha.demo
        </Text>
        <Text style={styles.demoCredentials}>
          Admin@123
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: '80%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 28,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  brand: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#0F172A',
    fontSize: 25,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 26,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    fontSize: 14,
  },
  error: {
    color: '#B91C1C',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    marginBottom: 16,
  },
  button: {
    minHeight: 48,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  demoNote: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 8,
  },
  demoCredentials: {
    color: '#475569',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 3,
  },
});
