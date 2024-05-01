import React, { useState } from 'react';
import {
  StatusBar,
  Keyboard,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Button,
} from 'react-native';
import { getAuth, signOut } from '@firebase/auth';
 

const API_KEY = '8158ea1b56e2497492b163654241204'; 

const firebaseConfig = {

  apiKey: "AIzaSyAVUe6aEZbDCHEtK3GKQ8z2krPtGCRn-pY",
  authDomain: "weather-app-a89c7.firebaseapp.com",
  projectId: "weather-app-a89c7",
  storageBucket: "weather-app-a89c7.appspot.com",
  messagingSenderId: "1032223150313",
  appId: "1:1032223150313:web:8d660be8d32a1d8b18e078",
  measurementId: "G-ZDJ2Z2D1ZR"

};


const weatherImages = {
  Sunny: require('../assets/backgrounds/sunny.png'),
  ClearNight: require('../assets/backgrounds/clear_night.png'),
  PartlyCloudy: require('../assets/backgrounds/partly_cloudy.png'),
  Foggy: require('../assets/backgrounds/foggy.png'),
  Cloudy: require('../assets/backgrounds/cloudy.png'),
  CloudyNight: require('../assets/backgrounds/cloudy_night.png'),
  Overcast: require('../assets/backgrounds/overcast.png'),
  Rain: require('../assets/backgrounds/rainy.png'),
  RainNight: require('../assets/backgrounds/rain_night.png'),
  Snow: require('../assets/backgrounds/snowy.png'),
  Sleet: require('../assets/backgrounds/sleet.png'),
};

const AuthenticatedScreen = ({ navigation, route }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [clothingSuggestions, setClothingSuggestions] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const user = route.params?.user || null; 

  const fetchClothingSuggestions = (weatherCondition) => {
    let suggestions = [];
  
    if (weatherCondition.includes('Sunny')) {
      suggestions.push('Shorts', 'T-shirt', 'Sunglasses');
    } else if (weatherCondition.includes('cloudy')) {
      suggestions.push('Jeans', 'T-shirt', 'Jacket');
    } else if (weatherCondition.includes('rainy')) {
      suggestions.push('Raincoat', 'Umbrella', 'Boots');
    } else if (weatherCondition.includes('snowy')) {
      suggestions.push('Ski pants', 'Jacket', 'Snow boots');
    }else if (weatherCondition.includes('Clear')) {
      suggestions.push('shirt', 'shoes', 'pants');
    }else if (weatherCondition.includes('Overcast')) { 
      suggestions.push('Jeans', 'T-shirt', 'Jacket');
    }

    setClothingSuggestions(suggestions);
  };

  const fetchWeatherData = () => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zipCode}&days=7`)
     .then(response => response.json())
     .then(data => {
        console.log('Weather Data:', data);
        setWeatherData(data);
        fetchClothingSuggestions(data.current.condition.text);
        updateBackgroundImage(data.current.condition.text);
     })
     .catch(error => {
        console.error('Weather API error:', error.message);
        setBackgroundImage(null);
     });
  };

  const handleZipCodeChange = (text) => {
    setZipCode(text);
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const handlePress = () => {
    fetchWeatherData();
    Keyboard.dismiss();
};

  const updateBackgroundImage = (conditionText) => {
    const is_day = weatherData && weatherData.current && weatherData.current.is_day;
    if (conditionText.match(/sunny|clear/i)) {
      setBackgroundImage(is_day ? weatherImages.Sunny : weatherImages.ClearNight);
    } else if (conditionText.match(/partly cloudy/i)) {
      setBackgroundImage(weatherImages.PartlyCloudy);
    } else if (conditionText.match(/mist|fog/i)) {
      setBackgroundImage(weatherImages.Foggy);
    } else if (conditionText.match(/cloudy/i)) {
      setBackgroundImage(is_day ? weatherImages.Cloudy : weatherImages.CloudyNight);
    } else if (conditionText.match(/overcast/i)) {
      setBackgroundImage(weatherImages.Overcast);
    } else if (conditionText.match(/rain|drizzle|shower/i)) {
      setBackgroundImage(is_day ? weatherImages.Rain : weatherImages.RainNight);
    } else if (conditionText.match(/snow|blizzard/i)) {
      setBackgroundImage(weatherImages.Snow);
    } else if (conditionText.match(/sleet/i)) {
      setBackgroundImage(weatherImages.Sleet);
    } else {
      setBackgroundImage(null);
    }
  };
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
        navigation.navigate('AuthScreen'); // Navigate back to the login screen
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          const { user } = await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
          navigation.navigate('AuthenticatedScreen', { user });
        } else {
          // Sign up
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
          navigation.navigate('AuthenticatedScreen', { user });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };
  
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <SafeAreaView style={styles.container}>
          <Text>Enter Zip Code:</Text>
          <TextInput
            style={styles.input}
            value={zipCode}
            onChangeText={(text) => setZipCode(text)}
            placeholder="Enter zip code"
            keyboardType="numeric"
          />
          <Button
            title="Get Weather"
            onPress={handlePress}
          />
          <StatusBar style="auto" />

          {weatherData && weatherData.current && (
            <View style={styles.weatherContainer}>
              <Text> you are in {weatherData.location.name}, {weatherData.location.region} </Text>
              <Text>Current Weather:</Text>
              <Text>Temperature: {weatherData.current.temp_f}</Text>
              <Text>Condition: {weatherData.current.condition.text}</Text>
              <Text>Time: {weatherData.location.localtime}</Text>

              {/* Include clothing suggestions component */}
              <View style={styles.clothingSuggestionsContainer}>
                <Text>Clothing Suggestions:</Text>
                {clothingSuggestions.map((suggestion, index) => (
                  <Text key={index}>{suggestion}</Text>
                ))}
              </View>
            </View>
          )}
        </SafeAreaView>
        <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default AuthenticatedScreen;
