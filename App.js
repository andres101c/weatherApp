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
} from 'react-native';

const API_KEY = '8158ea1b56e2497492b163654241204';
//images added by zach 
const weatherImages = {
  Sunny: require('./assets/backgrounds/sunny.png'),
  ClearNight: require('./assets/backgrounds/clear_night.png'),
  PartlyCloudy: require('./assets/backgrounds/partly_cloudy.png'),
  Foggy: require('./assets/backgrounds/foggy.png'),
  Cloudy: require('./assets/backgrounds/cloudy.png'),
  CloudyNight: require('./assets/backgrounds/cloudy_night.png'),
  Overcast: require('./assets/backgrounds/overcast.png'),
  Rain: require('./assets/backgrounds/rainy.png'),
  RainNight: require('./assets/backgrounds/rain_night.png'),
  Snow: require('./assets/backgrounds/snowy.png'),
  Sleet: require('./assets/backgrounds/sleet.png'),
};
//changes made fo the use state for background image 
const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);

  const fetchWeatherData = () => {
    if (zipCode.trim()) {
      Keyboard.dismiss();
      fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zipCode.trim()}&days=7`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setZipCode('');
          updateBackgroundImage(data.current.condition.text);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setBackgroundImage(null);
        });
    }
  };
//background image created by zach 
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
//styles and displays created by zach 
  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>Enter Zip Code</Text>
        <TextInput
          style={styles.input}
          value={zipCode}
          onChangeText={setZipCode}
          placeholder="Enter zip code"
          keyboardType="numeric"
          onSubmitEditing={fetchWeatherData}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeatherData}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
        {weatherData && weatherData.current && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherTitle}>Current Weather</Text>
            <Image
              style={styles.weatherIcon}
              source={{ uri: `https:${weatherData.current.condition.icon}` }}
            />
            <Text style={styles.largeWeatherText}>Temperature: {weatherData.current.temp_f} °F</Text>
            <Text style={styles.weatherText}>Condition: {weatherData.current.condition.text}</Text>
            <Text style={styles.weatherText}>Time: {weatherData.location.localtime}</Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFFFFFAA',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: '#007BFFAA',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  largeWeatherText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  weatherText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});

export default App;
