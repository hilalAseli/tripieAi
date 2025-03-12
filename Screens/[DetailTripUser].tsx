import React from 'react';
import {View, Image, Text, ScrollView} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function DetailTripUser({route}) {
  const {item} = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#FFFFFF'}}
      showsVerticalScrollIndicator={false}>
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 10,
          right: 10,
          zIndex: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <IconButton
          icon={'arrow-left'}
          iconColor="white"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>

      <Image
        source={{uri: item.imageUrl}}
        style={{
          width: '100%',
          height: 300,
          resizeMode: 'cover',
        }}
      />

      <View style={{padding: 20, marginTop: -20, backgroundColor: '#F5F5F5', borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 26,
            color: 'black',
            marginBottom: 8,
          }}>
          {item.destination}
        </Text>
        <Text
          style={{
            fontFamily: 'Outfit-Medium',
            fontSize: 18,
            color: '#555555',
          }}>
          {item.duration}
        </Text>
      </View>

      <View style={{padding: 20}}>
        {item.itinerary?.map((dayPlan, index) => (
          <View key={index}>
            <View
              style={{
                backgroundColor: '#E3F2FD',
                borderRadius: 10,
                marginBottom: 15,
                paddingVertical: 12,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Outfit-Bold',
                  fontSize: 20,
                  color: 'black',
                  textAlign: 'center',
                }}>
                {dayPlan.day}
              </Text>
            </View>

            {dayPlan.activities.map((activity, actIndex) => (
              <Card
                key={actIndex}
                style={{
                  marginBottom: 15,
                  padding: 20,
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                  borderRadius: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#DDD',
                    paddingBottom: 12,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Medium',
                      fontSize: 18,
                      color: 'black',
                      flex: 1,
                    }}>
                    📋 {activity.activity}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#757575',
                      fontSize: 16,
                    }}>
                    ⏰ {activity.time}
                  </Text>
                </View>

                <View style={{gap: 10}}>
                  <Text style={{fontFamily: 'Outfit-Regular', color: 'black'}}>
                    💬 {activity.description}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#43A047',
                      fontSize: 16,
                    }}>
                    💸 {activity.cost}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
