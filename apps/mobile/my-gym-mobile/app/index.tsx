// apps/mobile/app/index.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link } from 'expo-router';
import { Dumbbell, Mail, Lock, Eye, Zap, Clock, Plus } from 'lucide-react-native';

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';

const API_URL = 'http://localhost:3000';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Por favor, insira um email válido');
      return;
    }
    
    setIsLoading(true);
    
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
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
            <View style={styles.logoContainer}>
              <Dumbbell size={28} color="#58a6ff" />
            </View>
            <Text style={styles.title}>MyGym</Text>
            <Text style={styles.subtitle}>Sua plataforma de treinos</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Mail style={styles.inputIcon} size={18} color="#8b949e" />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#8b949e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Lock style={styles.inputIcon} size={18} color="#8b949e" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#8b949e"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Eye size={18} color="#8b949e" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Não tem uma conta? 
              </Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Zap size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.featureTitle}>Simples e Rápido</Text>
            <Text style={styles.featureSubtitle}>Registre suas séries em segundos.</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Clock size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.featureTitle}>Histórico Completo</Text>
            <Text style={styles.featureSubtitle}>Acompanhe sua evolução.</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Plus size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.featureTitle}>Customizável</Text>
            <Text style={styles.featureSubtitle}>Crie seus treinos e exercícios.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    padding: 24,
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#30363d',
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    color: '#c9d1d9',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#8b949e',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#c9d1d9',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    color: '#c9d1d9',
    paddingVertical: 10,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins_400Regular',
    color: '#58a6ff',
    fontSize: 14,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    color: '#f85149',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontFamily: 'Poppins_400Regular',
    color: '#8b949e',
    fontSize: 14,
    marginRight: 4,
  },
  signupLink: {
    fontFamily: 'Poppins_400Regular',
    color: '#58a6ff',
    fontSize: 14,
  },
  featuresSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#8b949e',
    textAlign: 'center',
  },
});