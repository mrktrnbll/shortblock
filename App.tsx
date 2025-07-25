import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import IonIcons from '@react-native-vector-icons/ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LogScreen from './src/screens/LogScreen';

enableScreens();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#1e1e1e',
              borderTopWidth: 0,
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
            },
            tabBarActiveTintColor: '#4ADE80',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarIcon: ({ color, size }) => {
              let iconName: string;

              if (route.name === 'Home') {
                iconName = 'home-outline';
              } else if (route.name === 'Settings') {
                iconName = 'settings-outline';
              } else if (route.name === 'Logs') {
                iconName = 'archive-outline';
              } else {
                iconName = 'help-outline';
              }

              return <IonIcons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Logs" component={LogScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

