import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import StartNewTripCard from './components/StartNewTripCard';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Card, IconButton} from 'react-native-paper';
import {getAuth} from 'firebase/auth';

export default function MyTrip() {
  const [planned, setPlanned] = useState<any[]>([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
    setLoading(false);
  }, []);

  const fetchPlaned = async () => {
    if (!userId) {
      console.log('User not authenticated');
      return;
    }
    try {
      const response = await axios.get(
        `http://192.168.1.10:3000/getUserData?userId=${userId}`,
      );
      const fetchAllPlanned = response.data.dataUser.flatMap(
        user =>
          user.userTravelPlan?.map(plan => ({
            ...plan,
            fullname: user.fullname || 'unknown user',
          })) || [],
      );
      setPlanned(fetchAllPlanned);
    } catch (err) {
      console.log('Error fetching planned trips:', err);
    }
  };

  const handleDelete = async (itemDelete: string) => {
    try {
      console.log(itemDelete);
      await axios.delete(
        `http://192.168.1.10:3000/deletePlanner/${userId}/trips/${itemDelete}`,
      );
      ToastAndroid.show('Plan perjalanan telah dihapus', ToastAndroid.BOTTOM);
      fetchPlaned();
    } catch (err) {
      console.log(err, 'Gagal delete');
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        fetchPlaned();
      }
    }, [userId, loading]),
  );

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 55,
        backgroundColor: '#F5F7FA',
        flex: 1,
        paddingBottom: '30%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontFamily: 'Outfit-Bold', fontSize: 35, color: 'black'}}>
          My Trips 
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchPlace')}>
          <Icon name="add-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>
      {planned?.length === 0 ? (
        <StartNewTripCard />
      ) : (
        <View style={{marginTop: 30}}>
          <FlatList
            style={{marginBottom: 50}}
            showsVerticalScrollIndicator={false}
            data={planned}
            renderItem={({item}) => (
              <Card
                style={{
                  margin: 10,
                  overflow: 'hidden',
                  borderRadius: 10,
                  elevation: 4,
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E8EAED',
                  borderWidth: 1,
                }}
                onPress={() =>
                  navigation.navigate('DetailTripUser', {item: item})
                }>
                <Card.Cover
                  source={{uri: item.imageUrl}}
                  style={{borderRadius: 0}}
                />
                <View
                  style={{
                    padding: 15,
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  }}>
                  <Text
                    style={{
                      color: '#2A5298',
                      fontFamily: 'Outfit-Medium',
                      fontSize: 18,
                    }}>
                    🛣️ {item.tripName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#4A6FA5',
                      fontSize: 16,
                    }}>
                    🕑 {item.duration}
                  </Text>
                </View>
                <IconButton
                  icon="trash-can"
                  iconColor="#E53935"
                  size={25}
                  onPress={() => handleDelete(item.tripName)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: '#E8EAED',
                  }}
                />
              </Card>
            )}
          />
        </View>
      )}
    </View>
  );
}
