import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button } from 'react-native';

// andres ibanez api call

const API_KEY = '8158ea1b56e2497492b163654241204'; 

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [zipCode, setZipCode] = useState(''); 

  const fetchWeatherData = () => {
   

    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zipCode}&days=7`)
   

      .then(response => response.json())
      .then(data => {
        console.log('Weather Data:', data);
        setWeatherData(data);
      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Enter Zip Code:</Text>
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={(text)=> setZipCode(text)}
        placeholder="Enter zip code"
        keyboardType="numeric"
      />
      <Button
        title="Get Weather"
        onPress={fetchWeatherData}
      />
      <StatusBar style="auto" />
     
      {weatherData && weatherData.current && (
  <View style={styles.weatherContainer}>
    <Text>Current Weather:</Text>
    <Text>Temperature: {weatherData.current.temp_f}</Text>
    <Text>Condition: {weatherData.current.condition.text}</Text>
    <Text>time: {weatherData.location.localtime}</Text>
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

export default App;
