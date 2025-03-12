import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../../config/Firebase';
export default function Signup() {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = async (email, password, fullname) => {
    try {
      const response = await axios.post(
        'http://192.168.1.10:3000/handleSignUp',
        {
          email,
          password,
          fullname,
        },
      );
      if (response.data.status === 'success') {
        await signInWithEmailAndPassword(auth, email, password);
      }
      Alert.alert('Account Created!');
    } catch (err) {
      console.log(err);
      Alert.alert('Error fe', err.message);
    }
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 50,
        backgroundColor: 'white',
        height: '100%',
      }}>
      <Text style={{fontFamily: 'Outfit-Bold', fontSize: 30}}>
        Create New Account
      </Text>

      <View style={{marginTop: 50}}>
        <Text style={{fontFamily: 'Outfit-Regular'}}>Full Name</Text>
        <TextInput
          onChangeText={setFullName}
          value={fullname}
          placeholder="Enter Full Name"
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: 'gray',
            fontFamily: 'Outfit-Regular',
          }}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontFamily: 'Outfit-Regular'}}>Email</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Enter Email"
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: 'gray',
            fontFamily: 'Outfit-Regular',
          }}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontFamily: 'Outfit-Regular'}}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter Password"
          secureTextEntry
          style={{
            padding: 15,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: 'gray',
            fontFamily: 'Outfit-Regular',
          }}
        />
      </View>

      <TouchableOpacity
        onPress={() => handleCreateAccount(email, password, fullname)}
        style={{
          padding: 15,
          backgroundColor: 'black',
          borderRadius: 15,
          marginTop: 50,
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Create Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          padding: 15,
          backgroundColor: 'white',
          borderRadius: 15,
          marginTop: 20,
          borderWidth: 1,
        }}>
        <Text style={{textAlign: 'center'}}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
