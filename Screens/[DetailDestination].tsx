import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function DetailDestination({route}) {
  const navigation = useNavigation();
  const {fsq_id} = route.params;
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `https://api.foursquare.com/v3/places/${fsq_id}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'fsq3keVlfAxNcADyKg8OiSoW00ijQxY8CHYybkCUSKBGtRg=',
          },
        },
      );
      const tempDetail = response.data;
      const imageUrl = tempDetail.fsq_id;
      const responseImage = await axios.get(
        `https://api.foursquare.com/v3/places/${imageUrl}/photos`,
        {
          headers: {
            Authorization: 'fsq3keVlfAxNcADyKg8OiSoW00ijQxY8CHYybkCUSKBGtRg=',
            Accept: 'application/json',
          },
        },
      );
      const tempPhoto = responseImage.data[0];
      const resultPhoto = tempPhoto
        ? `${tempPhoto.prefix}original${tempPhoto.suffix}`
        : 'https://placehold.co/300';

      const responseTip = await axios.get(
        `https://api.foursquare.com/v3/places/${fsq_id}/tips`,
        {
          headers: {
            Authorization: 'fsq3keVlfAxNcADyKg8OiSoW00ijQxY8CHYybkCUSKBGtRg=',
            Accept: 'application/json',
          },
        },
      );
      const tipData = responseTip.data;

      setDetail({
        tips: tipData.map(item => item.text),
        name: tempDetail.name,
        address: tempDetail.location.address,
        formatted_address: tempDetail.location.formatted_address,
        category: tempDetail.categories[0]?.name,
        imageUrl: resultPhoto,
      });

      console.log('berhasil', fsq_id);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        ) : detail ? (
          <View>
            <IconButton
              onPress={() => navigation.goBack()}
              icon={'arrow-left'}
              iconColor="white"
              size={30}
              style={{
                position: 'absolute',
                top: 20,
                left: 10,
                zIndex: 10,
              }}
            />
            <Image
              source={{uri: detail.imageUrl}}
              style={{width: '100%', height: 300}}
            />
            <View style={{padding: 20, paddingBottom: 80}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Bold',
                  fontSize: 22,
                  color: 'black',
                  marginBottom: 8,
                }}>
                {detail.name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  fontSize: 18,
                  color: 'gray',
                  marginBottom: 8,
                }}>
                {detail.category}
              </Text>
              <View style={{gap: 10}}>
                <Text
                  style={{
                    fontFamily: 'Outfit-Bold',
                    color: 'black',
                    fontSize: 20,
                  }}>
                  Tips:
                </Text>
                {detail.tips.length > 0 ? (
                  detail.tips.map((tip, index) => (
                    <Text
                      key={index}
                      style={{color: 'black', fontFamily: 'Outfit-Regular'}}>
                      💡 {tip}
                    </Text>
                  ))
                ) : (
                  <Text style={{color: 'gray', fontFamily: 'Outfit-Regular',textAlign:'center'}}>
                    Belum ada tips untuk tempat ini 😊
                  </Text>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {!loading && detail && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: 'skyblue',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 20,
            elevation: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('CurrentCountry', {
              place: [
                {key: 'place', name: detail.name},
                {key: 'imageUrl', imageUrl: detail.imageUrl},
              ],
            });
          }}>
          <Text
            style={{
              fontFamily: 'Outfit-Bold',
              fontSize: 16,
              color: 'white',
              textTransform: 'uppercase',
            }}>
            Make Your Travel Plan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
