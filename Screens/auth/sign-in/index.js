import { 
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/Firebase';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignin = async (email, password) => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Email dan password wajib diisi!');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Format email tidak valid!');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        Alert.alert('Error', 'Email belum terdaftar!');
      } else if (err.code === "auth/wrong-password") {
        Alert.alert('Error', 'Password yang kamu masukkan salah!');
      } else {
        Alert.alert('Error', err.message || 'Terjadi kesalahan. Coba lagi nanti.');
      }
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ padding: 25, paddingTop: 80, flexGrow: 1 }}
        >
          <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 30 }}>
            Let's Sign You In
          </Text>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 30,
              color: 'gray',
              marginTop: 20,
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 30,
              color: 'gray',
              marginTop: 10,
            }}
          >
            You've been missed!
          </Text>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: 'Outfit-Regular' }}>Email</Text>
            <TextInput
              onChangeText={value => setEmail(value)}
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
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'Outfit-Regular' }}>Password</Text>
            <TextInput
              placeholder="Enter Password"
              onChangeText={value => setPassword(value)}
              value={password}
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
            onPress={() => handleSignin(email, password)}
            style={{
              padding: 15,
              backgroundColor: 'black',
              borderRadius: 15,
              marginTop: 50,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={{
              padding: 15,
              backgroundColor: 'white',
              borderRadius: 15,
              marginTop: 20,
              borderWidth: 1,
            }}
          >
            <Text style={{ textAlign: 'center' }}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
