import axios from 'axios';
import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import {getAuth} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';

export default function GenerateTravel({route}) {
  const navigation = useNavigation();
  const {resultPlace, resultComingWith, resultBudget, selectedCountry} =
    route.params;
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const budget = resultBudget.range;
  const comingWith = resultComingWith.title;
  const place = resultPlace.map(item => item.name);
  const imageUrl = resultPlace.map(item => item.imageUrl);
  const getGenerate = async () => {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      const userId = user ? user.uid : '';
      const prompt = `Lokasiku saat ini di ${selectedCountry} dan Aku punya rencana trip ke ${place} dengan budget sekitar ${budget} dan perjalanannya ini bareng ${comingWith}. Tolong buatin aku itinerary lengkap dari berangkat sampai pulang, rekomendasi tempat wisata yang cocok buat kondisi ini, tempat makan enak sesuai budget, aktivitas seru yang cocok buat ${comingWith}, plus estimasi biaya detail biar aku tau total pengeluaran. Jangan lupa tambahin tips-tips biar tripnya makin seru dan hemat. Kalau bisa, kasih rekomendasi hidden gem juga biar ga terlalu mainstream. Format jawabanya json dengan struktur {
        "tripName": "Nama Trip",
        "destination": "Tempat tujuan",
        "duration": "Durasi perjalanan",
        "imageUrl": "${imageUrl}",
        "itinerary": [
          {
            "day": "Hari 1",
            "activities": [
              {
                "time": "08:00",
                "activity": "Nama aktivitas",
                "description": "Deskripsi",
                "cost": "Biaya"
              }
            ]
          }
        ],
        "totalBudget": "Total estimasi biaya",
        "tips": ["Tip 1", "Tip 2"]
      }. dan jangan buat tambahan apapun cukup berikan saya json nya saja dan jangan berikan string BERIKAN SATU REKOMENDASI TRIP YANG MENARIK UNTUK SATU DESTINASI YANG SAYA MINTA SAJA DAN JANGAN SENTUH BAGIAN imageURL NYA DAN BERIKAN JAWABAN NYA DENGAN BAHASA INGGRIS JIKA LOKASI SAYA SAAT INI BUKAN DI INDONESIA DAN JIKA DI INDONESIA BERIKAN JAWABANYA MEMAKAI BAHASA INDONESIA`;

      await axios.post('http://192.168.1.10:3000/allPrompt', {prompt, userId});
      setGenerated(true);
    } catch (err) {
      console.error('Error saat generate plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getGenerate();
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    };
    fetchData();
  }, []);

  return (
    <View style={{padding: 25, paddingTop: 75, flex: 1}}>
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <LottieView
            source={require('../assets/loading.json')}
            autoPlay
            loop
            style={{width: 350, height: 350}}
          />
          <Text
            style={{
              fontSize: 16,
              color: 'gray',
              fontFamily: 'Outfit-Regular',
              textAlign: 'center',
            }}>
            ✈️ Membuat rencana perjalananmu... Harap tunggu sebentar ya!
          </Text>
        </View>
      ) : generated ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <LottieView
            source={require('../assets/success.json')}
            autoPlay
            loop={false}
            style={{width: 300, height: 300}}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
              fontFamily: 'Outfit-Bold',
            }}>
            Rencana Perjalanan Berhasil Dibuat!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Hometabs')}
            style={{
              backgroundColor: 'black',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 30,
            }}>
            <Text
              style={{color: 'white', fontSize: 16, fontFamily: 'Outfit-Bold'}}>
              Kembali
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
