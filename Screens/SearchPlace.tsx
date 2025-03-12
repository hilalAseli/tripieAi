import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import axios from 'axios';
import {Card, Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function SearchPlace() {
  const API_KEY_UNSPLASH = 'rChY4yJHEQRPxtuD3hWJ2GwiziyzL86MpQL9b-MxPFU';
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<any[]>([]);
  const fadeanim = useRef(new Animated.Value(0)).current;
  const transformY = useRef(new Animated.Value(30)).current;
  const [isLoading, setLoading] = useState<true | false>(false);
  const navigation = useNavigation();
  const handleSearch = async () => {
    setLoading(true);
    try {
      const locationRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      );

      if (locationRes.data.length === 0) {
        ToastAndroid.show('Tempat tidak ditemukan', ToastAndroid.BOTTOM);
        return;
      }

      const place = locationRes.data[0];

      const imageRes = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: query,
            client_id: API_KEY_UNSPLASH,
            per_page: 1,
          },
        },
      );

      const image = imageRes.data.results[0]?.urls?.regular || null;

      Animated.timing(fadeanim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      Animated.timing(transformY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();

      setResult([
        {
          name: place.display_name,
          imageUrl: image,
          lat: place.lat,
          lon: place.lon,
        },
      ]);

      setLoading(false);
    } catch (err) {
      console.log('error log:', err);
    }
  };

  return (
    <View
      style={{padding: 25, paddingTop: 100, backgroundColor: 'white', flex: 1}}>
      <View style={{gap: 15}}>
        <Searchbar
          value={query}
          onChangeText={setQuery}
          style={{
            borderRadius: 15,
            borderColor: 'gray',
            backgroundColor: 'white',
            borderWidth: 0.5,
          }}
          placeholderTextColor={'gray'}
          iconColor="#87CEEB"
          inputStyle={{color: '#000000'}}
          placeholder="Find for destination..."
        />
        <TouchableOpacity
          disabled={!query}
          onPress={handleSearch}
          style={{
            backgroundColor: !query ? '#e0e0e0' : 'skyblue',
            padding: 10,
            borderRadius: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: !query ? "#999999" : "white",
              fontFamily: 'Outfit-Bold',
            }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <ActivityIndicator color={'black'} size={'large'} />
        </View>
      ) : (
        <FlatList
          data={result}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <Animated.View
              style={{
                opacity: fadeanim,
                transform: [{translateY: transformY}],
              }}>
              <Card
                style={{
                  marginTop: 20,
                  elevation: 2,
                  borderRadius: 15,
                  flex: 1,
                  margin: 5,
                }}>
                {item.imageUrl ? (
                  <Card.Cover source={{uri: item.imageUrl}} />
                ) : (
                  <Text style={{textAlign: 'center', padding: 10}}>
                    Gambar tidak tersedia
                  </Text>
                )}
                <Card.Content style={{padding: 10}}>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Bold',
                      color: 'black',
                      fontSize: 16,
                    }}>
                    {item.name}
                  </Text>
                  <Text style={{fontFamily: 'Outfit-Regular'}}>
                    Latitude: {item.lat}
                  </Text>
                  <Text style={{fontFamily: 'Outfit-Regular'}}>
                    Longitude: {item.lon}
                  </Text>
                </Card.Content>
              </Card>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CurrentCountry', {place: result})
                }
                style={{
                  backgroundColor: 'skyblue',
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 14,
                  }}>
                  Proceed to Travel Companion Selection
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}
