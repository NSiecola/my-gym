import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Dumbbell, Mail, Lock, Zap, History, Plus } from 'lucide-react-native';

import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const API_URL = 'http://localhost:3000';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const handleSubmit = async () => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Algo deu errado no login');
      }
      await AsyncStorage.setItem('authToken', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.card}>
          <View style={styles.header}>
            <Dumbbell size={48} color="white" />
            <Text style={styles.title}>MyGym</Text>
            <Text style={styles.subtitle}>Sua plataforma de treinos</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail style={styles.inputIcon} size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Lock style={styles.inputIcon} size={20} color="#9ca3af" />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity>
               <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Não tem uma conta?{' '}
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Zap size={28} color="white" />
            </View>
            <Text style={styles.featureTitle}>Simples e Rápido</Text>
            <Text style={styles.featureSubtitle}>Registre suas séries em segundos durante o treino.</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <History size={28} color="white" />
            </View>
            <Text style={styles.featureTitle}>Histórico Completo</Text>
            <Text style={styles.featureSubtitle}>Acompanhe sua evolução exercício por exercício.</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Plus size={28} color="white" />
            </View>
            <Text style={styles.featureTitle}>Totalmente Customizável</Text>
            <Text style={styles.featureSubtitle}>Crie suas rotinas e exercícios personalizados.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
  },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontFamily: 'Poppins_700Bold', fontSize: 40, color: '#fff', marginTop: 16, marginBottom: 8 },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: 16, color: '#a1a1aa' },
  form: { width: '100%' },
  inputContainer: { position: 'relative', width: '100%', marginBottom: 15 },
  inputIcon: { position: 'absolute', left: 15, top: 15, zIndex: 1 },
  input: { fontFamily: 'Poppins_400Regular', backgroundColor: '#27272a', color: '#fff', paddingLeft: 50, paddingRight: 15, paddingVertical: 15, borderRadius: 8, fontSize: 16 },
  forgotPasswordText: { fontFamily: 'Poppins_400Regular', color: '#a1a1aa', fontSize: 14, textAlign: 'right', marginBottom: 16 },
  button: { backgroundColor: '#fff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { fontFamily: 'Poppins_700Bold', color: '#000', fontSize: 16 },
  signupText: { fontFamily: 'Poppins_400Regular', color: '#a1a1aa', textAlign: 'center', marginTop: 24 },
  signupLink: { color: '#fff', fontWeight: 'bold' },
  errorText: { fontFamily: 'Poppins_400Regular', color: '#ef4444', textAlign: 'center', marginBottom: 10 },

  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 64,
    alignItems: 'center',
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 32,
  },
  featureIconContainer: {
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontFamily: 'Poppins_400Regular',
    color: '#a1a1aa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});