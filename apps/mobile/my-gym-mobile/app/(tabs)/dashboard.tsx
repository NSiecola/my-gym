// apps/mobile/app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Play, Plus, ChevronRight } from 'lucide-react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

interface WorkoutSession { id: number; routine_name: string; start_time: string; }

// Função para extrair o primeiro nome do email
const getFirstNameFromEmail = (email: string) => {
  if (!email) return 'Atleta';
  const namePart = email.split('@')[0];
  // Transforma "joao.silva" em "Joao"
  return namePart.split('.')[0].charAt(0).toUpperCase() + namePart.split('.')[0].slice(1);
}

export default function DashboardScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [userName, setUserName] = useState("Atleta");
  const [isLoading, setIsLoading] = useState(true);

  let [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        // Decodificar o token para pegar o email do usuário
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(getFirstNameFromEmail(payload.email));

        const response = await fetch('http://localhost:3000/api/sessions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha ao buscar treinos.');
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading || !fontsLoaded) {
    return <View style={styles.container}><Text style={styles.loadingText}>Carregando...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.welcomeTitle}>Bem-vindo de volta,</Text>
        <Text style={styles.userName}>{userName}</Text>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.mainButton}>
            <Play size={18} color="black" />
            <Text style={styles.mainButtonText}>Iniciar Treino</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Plus size={18} color="white" />
            <Text style={styles.secondaryButtonText}>Criar Novo Treino</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Seus Treinos Recentes</Text>
          <View style={styles.historyList}>
            {sessions.slice(0, 5).map(session => (
              <TouchableOpacity key={session.id} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyItemTitle}>{session.routine_name || 'Treino Livre'}</Text>
                  <Text style={styles.historyItemSubtitle}>
                    {new Date(session.start_time).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
                <ChevronRight size={20} color="#71717A" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { padding: 16 },
  loadingText: { color: 'white', fontFamily: 'Poppins_400Regular' },
  welcomeTitle: { fontFamily: 'Poppins_400Regular', color: 'white', fontSize: 24 },
  userName: { fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 32, marginBottom: 24 },
  actionButtonsContainer: { gap: 12, marginBottom: 32 },
  mainButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', paddingVertical: 16, borderRadius: 12, gap: 8 },
  mainButtonText: { fontFamily: 'Poppins_700Bold', color: 'black', fontSize: 18 },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181B', paddingVertical: 16, borderRadius: 12, gap: 8 },
  secondaryButtonText: { fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 18 },
  historyContainer: {},
  sectionTitle: { fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 20, marginBottom: 16 },
  historyList: { gap: 12 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181B', padding: 20, borderRadius: 12 },
  historyItemTitle: { fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 16 },
  historyItemSubtitle: { fontFamily: 'Poppins_400Regular', color: '#a1a1aa', fontSize: 14, marginTop: 4 },
});