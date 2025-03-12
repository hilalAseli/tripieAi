import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Hometabs from './Hometabs';
import Signin from '../../Screens/auth/sign-in';
import Signup from '../../Screens/auth/sign-up';
import Login from '../../Screens/Login';
import {onAuthStateChanged, User} from 'firebase/auth';
import {auth} from '../../config/Firebase';
import SearchPlace from '../../Screens/SearchPlace';
import TripMateCount from '../../Screens/TripMateCount';
import TripBudgetSelection from '../../Screens/TripBudgetSelection';
import GenerateTravel from '../../Screens/GenerateTravel';
import DetailTripUser from '../../Screens/[DetailTripUser]';
import DetailDestination from '../../Screens/[DetailDestination]';
import CurrentCountry from '../../Screens/CurrentCountry';
const Stack = createStackNavigator();
export default function Route() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  if (loading) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen name="Hometabs" component={Hometabs} />
            <Stack.Screen
              name="SearchPlace"
              component={SearchPlace}
              options={{
                headerShown: true,
                headerTransparent: true,
                headerTitleStyle: {fontFamily: 'Outfit-Bold', color: 'black'},
                headerTintColor: 'black',
              }}
            />
            <Stack.Screen
              name="TripMateCount"
              component={TripMateCount}
              options={{
                headerShown: true,
                headerTransparent: true,
                headerTitleStyle: {fontFamily: 'Outfit-Bold'},
                headerTintColor: 'black',
                title: "Who's Coming?",
              }}
            />
            <Stack.Screen
              name="TripBudgetSelection"
              component={TripBudgetSelection}
              options={{
                headerShown: true,
                headerTransparent: true,
                headerTitleStyle: {fontFamily: 'Outfit-Bold'},
                headerTintColor: 'black',
                title: 'Trip Expense Level',
              }}
            />
            <Stack.Screen
              name="GenerateTravel"
              component={GenerateTravel}
              options={{
                headerShown: true,
                headerTransparent: true,
                headerTitleStyle: {fontFamily: 'Outfit-Bold'},
                title: 'Membuat Rekomendasi',
              }}
            />
            <Stack.Screen name="DetailTripUser" component={DetailTripUser} />
            <Stack.Screen
              name="DetailDestination"
              component={DetailDestination}
            />
            <Stack.Screen
              name="CurrentCountry"
              component={CurrentCountry}
              options={{
                headerTitle: 'select your current country',
                headerShown: true,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
