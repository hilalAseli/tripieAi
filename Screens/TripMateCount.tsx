import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

export default function TripMateCount({route}) {
  const {place, selectedCountry} = route.params;
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

  const travelOptions = [
    {id: 1, title: 'With family', icon: '👨‍👩‍👧‍👦'},
    {id: 2, title: 'With friends', icon: '👥'},
    {id: 3, title: 'Solo Traveling', icon: '🧳'},
    {id: 4, title: 'Business Travel', icon: '💼'},
  ];

  const handleOptionSelect = optionId => {
    setSelectedOption(optionId);
  };

  const handleNavigate = () => {
    console.log(place, 'tes');
    if (selectedOption) {
      const resultSelected = travelOptions.find(
        option => option.id === selectedOption,
      );
      navigation.navigate('TripBudgetSelection', {
        userComingWith: resultSelected,
        place: place,
        selectedCountry: selectedCountry
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}>
      <View
        style={{
          backgroundColor: '#f8f8f8',
          borderRadius: 15,
          padding: 20,
          elevation: 5,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: '#000000',
            textAlign: 'center',
            marginBottom: 8,
          }}>
          Who's coming with you?
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#666666',
            textAlign: 'center',
            marginBottom: 25,
          }}>
          Select your trip type
        </Text>

        <View style={{marginBottom: 25}}>
          {travelOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                backgroundColor:
                  selectedOption === option.id ? '#E6F7FF' : '#ffffff',
                borderRadius: 10,
                marginBottom: 12,
                borderWidth: 1,
                borderColor:
                  selectedOption === option.id ? '#87CEEB' : '#e0e0e0',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={() => handleOptionSelect(option.id)}>
              <Text style={{fontSize: 24, marginRight: 15}}>{option.icon}</Text>
              <Text
                style={{
                  fontSize: 16,
                  color: selectedOption === option.id ? '#4A9CDB' : '#333333',
                  fontFamily:
                    selectedOption === option.id
                      ? 'Outfit-Bold'
                      : 'Outfit-Medium',
                }}>
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: selectedOption ? 'skyblue' : '#e0e0e0',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={handleNavigate}
          disabled={!selectedOption}>
          <Text
            style={{
              color: selectedOption ? '#ffffff' : '#999999',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Proceed to Budget Type Selection
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}