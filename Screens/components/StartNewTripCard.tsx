import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

export default function StartNewTripCard() {
  const navigation = useNavigation();
  return (
    <View style={{padding: 20, marginTop: 50, alignItems: 'center', gap: 25}}>
      <Icon name="location-sharp" size={30} color="black" />
      <Text style={{fontFamily: 'Outfit-Medium', color: 'black', fontSize: 25}}>
        No trips planned yet
      </Text>
      <Text
        style={{
          fontFamily: 'Outfit-Regular',
          color: 'gray',
          fontSize: 20,
          textAlign: 'center',
        }}>
        Looks like its time to plan a new travel experience! Get Started below
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchPlace')}
        style={{
          backgroundColor: '#2A2A2A',
          borderRadius: 15,
          padding: 15,
          paddingHorizontal: 30,
        }}>
        <Text
          style={{fontFamily: 'Outfit-Medium', color: 'white', fontSize: 17}}>
          Start e new trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}
