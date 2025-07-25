import React from 'react';
import { View } from 'react-native'
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
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 1,
            paddingTop: 3,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarIconContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          },
          tabBarActiveTintColor: '#164349ff',
          tabBarInactiveTintColor: '#000000ff',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = 'settings-outline';
            } else if (route.name === 'Logs') {
              iconName = 'archive-outline';
            } else {
              iconName = 'help-outline';
            }

            const iconWrapperSize = size + 28;

            return (
                  <View
                    style={{
                      width: iconWrapperSize,
                      height: iconWrapperSize / 1.5,
                      borderRadius: iconWrapperSize / 2,
                      backgroundColor: focused ? '#9dced49f' : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <IonIcons
                      name={iconName}
                      size={size}
                      color={focused ? '#164349ff' : color}
                    />
                  </View>
            );
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

