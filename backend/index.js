require('dotenv').config();
const express = require('express');
const {createUserWithEmailAndPassword} = require('firebase/auth');
const {auth} = require('../config/Firebase');
const admin = require('firebase-admin');
const {default: axios} = require('axios');

const serviceAccount = require('../tripieai-firebase-adminsdk-fbsvc-639e03d6b2.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const port = 3000;

app.use(express.json());

const geminiEndpoint =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/allPrompt', async (req, res) => {
  try {
    const {prompt, userId} = req.body;

    const response = await axios.post(
      `${geminiEndpoint}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{text: prompt}],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    let geminiReply = response.data.candidates[0].content.parts[0].text;
    geminiReply = geminiReply.replace('```json', '').replace('```', '').trim();
    let parseReply;
    try {
      parseReply = JSON.parse(geminiReply);
    } catch (err) {
      throw new Error('Invalid JSON from GEMINI');
    }
    if (
      !parseReply.tripName ||
      !parseReply.destination ||
      !parseReply.duration ||
      !parseReply.itinerary
    ) {
      throw new Error('Missing required fields in travel plan');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const userTravelPlan = userData.userTravelPlan || [];

    await userRef.update({
      userTravelPlan: [...userTravelPlan, parseReply],
    });

    res.status(200).json({
      message: 'Prompt Berhasil Dibuat',
      data: geminiReply,
      success: true,
    });

    console.log('Berhasil call Gemini');
  } catch (err) {
    console.log('Error saat call Gemini', err.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan respon dari Gemini',
      error: err.message,
    });
  }
});

app.get('/getUserData', async (req, res) => {
  try {
    const {userId} = req.query;

    if (!userId) {
      return res.status(400).json({message: 'userId is required'});
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({message: 'User not found'});
    }

    const userData = userDoc.data();
    if (!userData.userTravelPlan) {
      return res.status(404).json({message: 'User has no travel plans'});
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data user',
      dataUser: [userData],
    });
  } catch (err) {
    console.error('Error fetching user data err', err.message);
    res
      .status(500)
      .json({message: 'Error fetching user data err 500', error: err.message});
  }
});

app.post('/handleSignUp', async (req, res) => {
  try {
    const {email, password, fullname} = req.body;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const userRef = db.collection('users').doc(user.uid);
    await userRef.set({
      email,
      fullname,
      userTravelPlan: [],
    });

    res.json({status: 'success'});
  } catch (err) {
    console.error('Error saat signup:', err.message);
    res.status(500).json({message: 'Gagal signup', error: err.message});
  }
});

app.delete('/deletePlanner/:userId/trips/:deleteItem', async (req, res) => {
  try {
    const {userId, deleteItem} = req.params;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
        success: false,
      });
    }

    const userData = userDoc.data();
    const updatePlan = userData.userTravelPlan
      ? userData.userTravelPlan.filter(item => item.tripName !== deleteItem)
      : [];

    await userRef.update({
      userTravelPlan: updatePlan,
    });

    res.status(200).json({
      message: 'Semua rencana perjalanan berhasil dihapus',
      success: true,
    });
  } catch (err) {
    console.error('Gagal menghapus rencana perjalanan:', err);
    res.status(500).json({
      message: 'Gagal menghapus rencana perjalanan',
      error: err.message,
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
