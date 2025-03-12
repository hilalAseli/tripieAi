import {View, Text, FlatList, TouchableOpacity, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Searchbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

export default function CurrentCountry({route}) {
  const {place} = route.params;
  const navigation = useNavigation();
  const [country, setCountry] = useState<any[]>([]);
  const [countrySearchResult, setCountrySearchResult] = useState<any[]>([]);
  const [searchCountry, setSearchCountry] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const fetchCountry = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      setCountry(response.data.slice(0, 10));
    } catch (err) {
      console.error('Error fetching country data:', err);
    }
  };

  const handleSelect = (name: string) => {
    setSelectedCountry(name);
  };

  const handleSearch = async (text: string) => {
    setSearchCountry(text);
    if (text.trim()) {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${text}`,
        );
        setCountrySearchResult(response.data);
      } catch (err) {
        console.error('Error searching countries:', err);
      }
    }
  };

  const handleNext = () => {
    if (selectedCountry) {
      navigation.navigate('TripMateCount', {
        place: place,
        selectedCountry: selectedCountry,
      });
    } else {
      alert('Silakan pilih negara terlebih dahulu');
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#87CEEB" barStyle="dark-content" />
      <View style={{flex: 1, padding: 25}}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 20,
            flex: 1,
            elevation: 2,
          }}>
          <Text
            style={{
              fontSize: 24,
              color: '#000000',
              textAlign: 'center',
              marginBottom: 20,
              fontFamily: 'Outfit-Bold',
            }}>
            select your country
          </Text>

          <Searchbar
            value={searchCountry}
            onChangeText={handleSearch}
            placeholder="Find a country..."
            placeholderTextColor="#777777"
            iconColor="#87CEEB"
            inputStyle={{color: '#000000'}}
            style={{
              marginBottom: 20,
              borderRadius: 12,
              backgroundColor: '#f5f5f5',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              height: 50,
            }}
          />

          <FlatList
            data={searchCountry ? countrySearchResult : country}
            renderItem={({item}) => {
              const isSelected = selectedCountry === item.name?.common;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item.name?.common)}
                  style={{
                    backgroundColor: isSelected
                      ? '#E6F7FF'
                      : '#f5f5f5',
                    padding: 15,
                    borderRadius: 12,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? '#87CEEB'
                      : '#e0e0e0',
                    elevation: 2,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Medium',
                      fontSize: 16,
                      color: isSelected ? '#4A9CDB' : '#000000',
                    }}>
                    {item.name?.common}
                  </Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.cca3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 10}}
          />

          <TouchableOpacity
          disabled={!selectedCountry}
            onPress={handleNext}
            style={{
              marginTop: 15,
              height: 55,
              overflow: 'hidden',
              borderRadius: 15,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 15,
                backgroundColor:selectedCountry ? "skyblue" : "#e0e0e0"
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: selectedCountry ? "white" : "#999999",
                  fontFamily: 'Outfit-Bold',
                  fontSize: 14,
                }}>
                Proceed to Trip Type
              </Text>
            </View>

          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}