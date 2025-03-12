import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

export default function TripBudgetSelection({route}) {
  const navigation = useNavigation();
  const [selectedBudget, setSelectedBudget] = useState(null);
  const {userComingWith, place, selectedCountry} = route.params;
  const budgetOptions = [
    {
      id: 1,
      title: 'Budget',
      icon: '💰',
      range: '$30 - $60',
      description: 'Backpacker, hostels, public transport',
    },
    {
      id: 2,
      title: 'Mid-Range',
      icon: '💰💰',
      range: '$60 - $200',
      description: '3-star hotels, popular attractions',
    },
    {
      id: 3,
      title: 'Premium',
      icon: '💰💰💰',
      range: '$200 - $450',
      description: 'Resorts, fine dining, exclusive activities',
    },
    {
      id: 4,
      title: 'Luxury',
      icon: '💎',
      range: '$450+',
      description: 'Villas, VIP experiences, first-class travel',
    },
  ];
  

  const handleBudgetSelect = budgetId => {
    setSelectedBudget(budgetId);
  };

  const handleNavigate = () => {
    if (selectedBudget) {
      const selectedOption = budgetOptions.find(
        option => option.id === selectedBudget,
      );
      navigation.navigate('GenerateTravel', {
        resultPlace: place,
        resultComingWith: userComingWith,
        resultBudget: selectedOption,
        selectedCountry: selectedCountry,
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        paddingTop: 100,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: 8,
          marginTop: 20,
          textAlign: 'center',
        }}>
        Choose your travel budget
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: '#666666',
          marginBottom: 20,
          textAlign: 'center',
        }}>
       Adjust to your budget
      </Text>

      <ScrollView
        style={{marginBottom: 20}}
        showsVerticalScrollIndicator={false}>
        {budgetOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleBudgetSelect(option.id)}
            style={{
              backgroundColor:
                selectedBudget === option.id ? '#E6F7FF' : '#f5f5f5',
              borderRadius: 12,
              padding: 16,
              marginBottom: 15,
              elevation: 3,
              borderWidth: 2,
              borderColor: selectedBudget === option.id ? '#87CEEB' : '#e0e0e0',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Text style={{fontSize: 22, marginRight: 10}}>{option.icon}</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: selectedBudget === option.id ? '#4A9CDB' : '#000000',
                }}>
                {option.title}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: selectedBudget === option.id ? '#4A9CDB' : '#555555',
                marginBottom: 5,
              }}>
              {option.range}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: '#333333',
              }}>
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleNavigate}
        disabled={!selectedBudget}
        style={{
          backgroundColor: selectedBudget ? '#87CEEB' : '#e0e0e0',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text
          style={{
            color: selectedBudget ? '#ffffff' : '#999999',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Get it done
        </Text>
      </TouchableOpacity>
    </View>
  );
}
