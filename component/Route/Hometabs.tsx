import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Discover from '../../Screens/Discover';
import Profile from '../../Screens/Profile';
import MyTrip from '../../Screens/MyTrip';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: 'white',
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#2E2E2E',
          borderRadius: 99,
          marginHorizontal: 20,
          marginBottom: 20,
          position: 'absolute',
          bottom: 10,
        },
        tabBarItemStyle: {
          padding: 15,
        },
      }}
      sceneContainerStyle={{
        backgroundColor: 'black',
      }}>
      <Tab.Screen
        name="MyTrip"
        component={MyTrip}
        options={{
          tabBarIcon: ({size, color, focused}) => (
            <Icon
              name="location"
              color={focused ? 'skyblue' : color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon: ({size, color, focused}) => (
            <Icon
              name="globe"
              color={focused ? 'skyblue' : color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({size, color, focused}) => (
            <Icon
              name="person"
              color={focused ? 'skyblue' : color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
