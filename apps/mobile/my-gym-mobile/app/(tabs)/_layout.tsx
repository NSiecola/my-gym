// apps/mobile/app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Dumbbell, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#a1a1aa',
        tabBarStyle: {
          backgroundColor: '#18181B',
          borderTopWidth: 1,
          borderTopColor: '#27272a',
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts" // -> app/(tabs)/workouts.tsx
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // -> app/(tabs)/profile.tsx
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}