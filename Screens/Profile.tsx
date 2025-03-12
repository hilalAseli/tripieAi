import { View, Text,  } from 'react-native';
import React from 'react';
import { getAuth } from 'firebase/auth';

export default function Profile() {
  const user = getAuth().currentUser;

  return (
    <View style={{ flex: 1, padding: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>
          <Text style={{ fontSize: 18, color: 'gray', marginBottom: 10 }}>Email: {user.email}</Text>
          <Text style={{ fontSize: 16, color: 'gray' }}>UID: {user.uid}</Text>
        </>
      ) : (
        <Text style={{ fontSize: 18, color: 'red' }}>No user is signed in</Text>
      )}
    </View>
  );
}
