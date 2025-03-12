import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import axios from 'axios';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
export default function Discover() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState<any[]>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
        console.log(position.coords, 'posisi saat ini');
      },
      error => {
        console.log(error, 'error saat ambil lokasi');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.foursquare.com/v3/places/search',
        {
          params: {
            near: searchValue ? searchValue : location,
            limit: 10,
            categories: '16000',
          },
          headers: {
            Authorization: 'fsq3keVlfAxNcADyKg8OiSoW00ijQxY8CHYybkCUSKBGtRg=',
            Accept: 'application/json',
          },
        },
      );
      const places = response.data.results;

      const fetchPlacesWithPhoto = await Promise.all(
        places.map(async item => {
          const responsePhoto = await axios.get(
            `https://api.foursquare.com/v3/places/${item.fsq_id}/photos`,
            {
              headers: {
                Authorization:
                  'fsq3keVlfAxNcADyKg8OiSoW00ijQxY8CHYybkCUSKBGtRg=',
                Accept: 'application/json',
              },
            },
          );
          const tempPhoto = responsePhoto.data[0];
          const resultPhoto = tempPhoto
            ? `${tempPhoto.prefix}original${tempPhoto.suffix}`
            : 'https://placehold.co/300';
          return {
            name: item.name,
            id: item.fsq_id,
            imageUrl: resultPhoto,
            country: item.location.country,
            admin_region: item.location.formatted_address,
          };
        }),
      );
      setPlaces(fetchPlacesWithPhoto);
      console.log('berhasil fetch data dan gambar');
      setLoading(false);
    } catch (err) {
      console.log(err, 'error ambil data');
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchValue(searchValue.trim());
      fetchPlaces();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLocation();
      fetchPlaces();
      setSearchValue("")
    }, []),
  );
  return (
    <ScrollView style={{backgroundColor: 'white', flex: 1}}>
      <View style={{padding: 25, gap: 15, marginTop: 50, paddingBottom: '25%'}}>
        <StatusBar barStyle={'dark-content'} />
        <Searchbar
          style={{
            backgroundColor: 'white',
            borderWidth: 0.5,
            borderColor: 'gray',
          }}
          iconColor="black"
          placeholder="Search destination..."
          inputStyle={{fontFamily: 'Outfit-Regular', color: 'black'}}
          placeholderTextColor={'gray'}
          value={searchValue}
          onChangeText={setSearchValue}
          onSubmitEditing={handleSearch}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              color: 'black',
              fontSize: 24,
            }}>
            Popular destinations around you
          </Text>
        </View>
        <View>
          {loading ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator color={'black'} size={'large'} />
            </View>
          ) : (
            <FlatList
              data={places}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DetailDestination', {fsq_id: item.id})
                  }>
                  <View style={{marginBottom: 15}}>
                    <Image
                      source={{uri: item.imageUrl}}
                      style={{width: '100%', height: 300, borderRadius: 30}}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        bottom: 10,
                        left: 20,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 20,
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            gap: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 5,
                            }}>
                            <Icon name="location" size={20} color="white" />
                            <Text
                              style={{
                                color: 'white',
                                fontFamily: 'Outfit-Regular',
                              }}>
                              {item.country}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Outfit-Medium',
                              fontSize: 22,
                              width: 250,
                            }}>
                            {item.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: 'skyblue',
                            borderRadius: 50,
                            padding: 10,
                          }}>
                          <Icon name="open-outline" size={30} color="white" />
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
