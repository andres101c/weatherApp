import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

const API_KEY = '8158ea1b56e2497492b163654241204'; // Your API key

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetch(`http://api.weatherapi.com/v1/forecast.xml?key=8158ea1b56e2497492b163654241204&q=07011&days=7`)
      .then(response => response.json())
      .then(data => {
        console.log('Weather Data:', data);
        setWeatherData(data);
        
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      {weatherData && (
        <View style={styles.weatherContainer}>
          <Text>Current Weather in London:</Text>
          <Text>Temperature: {weatherData.current.temp_c}°C</Text>
          <Text>Condition: {weatherData.current.condition.text}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default App;
