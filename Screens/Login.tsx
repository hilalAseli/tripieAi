import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  return (
    <View>
      <Image
        source={require('../images/travelPlanner.png')}
        style={{height: 400, width: '100%'}}
      />
      <View
        style={{
          backgroundColor: 'white',
          marginTop: -20,
          height: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 25,
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 30,
            textAlign: 'center',
            marginTop: 10,
          }}>
          TripieAI
        </Text>
        <Text
          style={{
            fontFamily: 'Outfit-Regular',
            fontSize: 17,
            textAlign: 'center',
            color: 'gray',
            marginTop: 20,
          }}>
          Planning a trip can be stressful – but not anymore! With TripieAI, you
          get your own super-smart AI travel assistant that helps you create the
          perfect trip, customized just for you.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <View
            style={{
              padding: 15,
              backgroundColor: 'black',
              borderRadius: 99,
              marginTop: '20%',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
                fontFamily: 'Outfit-Regular',
                textAlign: 'center',
              }}>
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
