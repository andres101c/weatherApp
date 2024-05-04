import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
    Image,
  } from 'react-native';

const API_KEY = '8158ea1b56e2497492b163654241204';

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
//UV icons 
import UVIcon from '../assets/icons/uv_icon.png';
import AirQualityIcon from '../assets/icons/air_quality_icon.png';

const ZipScreen = ({ navigation, route }) => {
  const [clothingSuggestions, setClothingSuggestions] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const {zip} = route.params;

  const fetchClothingSuggestions = (weatherCondition) => {
  let suggestions = [];
  let temp_f = 52; 

  if (weatherCondition.match('Sunny')) {
      suggestions.push('Shorts', 'T-shirt', 'Sunglasses');
      if(temp_f){
        suggestions.push('Apply Sunscreen')
      }
  } 
  
  else if (weatherCondition.match ('cloudy')) {
    if(temp_f){
      suggestions.push('Shorts', 'T-shirt'); 
        }
    else
      suggestions.push('Jeans', 'T-shirt', 'Jacket');
    
      } 
  
  else if (weatherCondition.match('rain')) {
      suggestions.push('Raincoat', 'Umbrella', 'Boots');
  }  

  else if (weatherCondition.match('snowy')) {
      suggestions.push('Ski pants', 'Jacket', 'Snow boots');
  }
  
  else if (weatherCondition.match('Clear')) {
    
    if(temp_f){
      suggestions.push('Shorts', 'T-shirt', 'Sunglasses','Apply Sunscreen')
    } 
    else 
      suggestions.push('Shirt', 'Light Sweatshit', 'Pants');
     
  } 
  
  else if (weatherCondition.match('Overcast')) { 
    if(temp_f){
      suggestions.push('Shorts', 'T-shirt')
    }
    else
      suggestions.push('Jeans', 'T-shirt', 'Jacket');
  }
  setClothingSuggestions(suggestions);
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

    const fetchWeatherData = async () => {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zip.zipCode}&days=7&aqi=yes`);
        const data = await response.json();
        console.log('Weather Data:', data);
        setWeatherData(data);
        fetchClothingSuggestions(data.current.condition.text);
        updateBackgroundImage(data.current.condition.text);
        setShowToggleButton(true);
        console.log(weatherData);
        return data;
    } catch (error) {
        console.error('Weather API error:', error.message);
        setBackgroundImage(null);
        setShowToggleButton(false);
        return null;
    }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);
        
    return (
        <ImageBackground source={backgroundImage} style={styles.fullScreenBackground}>
            <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar style="auto" />
                {weatherData && weatherData.current && (
                <View style={styles.weatherInfoContainer}>
                    <View style={styles.weatherInfoBackground}>
                    <Text style={styles.locationText}>{weatherData.location.name}, {weatherData.location.region}</Text>
                    <Text style={styles.temperatureText}>{weatherData.current.temp_f}°F</Text>
                    <Text style={styles.conditionText}>{weatherData.current.condition.text}</Text>
                    <Image style={styles.weatherIcon} source={{ uri: `https:${weatherData.current.condition.icon}` }} />
                    <Text style={styles.timeText}>Time: {weatherData.location.localtime}</Text>
                    </View>
                </View>
                )}
                
                {weatherData && weatherData.current && (
                <View style={styles.uvIndexContainer}>
                    <View style={styles.uvIndexHeader}>
                    <Image source={UVIcon} style={styles.uvIconStyle} />
                    <Text style={styles.uvIndexTitle}>UV Index</Text>
                    </View>
                    <Text style={styles.uvIndexValue}>{weatherData.current.uv}</Text>
                    <Text style={styles.uvAdvice}>{weatherData.current.uv >= 5 ? 'Wear sunscreen' : 'Low'}</Text>
                    </View>
                )}

                {weatherData && weatherData.current && (
                <View style={styles.aqiContainer}>
                    <View style={styles.uvIndexHeader}>
                    <Image source={AirQualityIcon} style={styles.uvIconStyle} />
                    <Text style={styles.uvIndexTitle}>Air Quality</Text>
                    </View>
                    <Text style={styles.uvIndexValue}>{weatherData.current.air_quality["us-epa-index"]}</Text>
                    <Text style={styles.uvAdvice}>{weatherData.current.air_quality["us-epa-index"] >= 4 ? 'Wear a mask' : 'Healthy'}</Text>
                    </View>
                )}

                {showToggleButton && (
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowSuggestions(!showSuggestions)}
                >
                    <Text style={styles.buttonText}>Toggle Clothing Suggestions</Text>
                </TouchableOpacity>
                )}

                {showSuggestions && (
                <View style={styles.dropdown}>
                    {clothingSuggestions.length > 0 ? clothingSuggestions.map((item, index) => (
                    <Text key={index} style={styles.dropdownItem}>{item}</Text>
                    )) : (
                    <Text style={styles.dropdownItem}>No suggestions available</Text>
                    )}
                </View>
                )}

                
            </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
      flex: 1,
      resizeMode: 'cover',
    },
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 16,
      margin: 20,
      bottom: 20,
    },
    input: {
      height: 50,
      backgroundColor: 'rgba(128, 128, 128, 0.5)', // Less transparent background
      borderColor: 'rgba(128, 128, 128, 0.5)', // Matching border color
      borderWidth: .25,
      marginBottom: 20,
      padding: 10,
      borderRadius: 10,
      fontSize: 18,
      color: 'white',
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
    weatherInfoContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    weatherInfoBackground: {
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    locationText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    temperatureText: {
      marginTop: 5,
      fontSize: 30,
      textAlign: 'center',
      color: 'white',
    },
    conditionText: {
      marginTop: 5,
      fontSize: 16,
      textAlign: 'center',
      color: 'white',
    },
    weatherIcon: {
      width: 80,
      height: 80,
      alignSelf: 'center',
    },
    timeText: {
      fontSize: 14,
      color: 'white', 
    },
    uvIndexContainer: {
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: 'flex-start', 
      marginTop: 20,
    },
    uvIndexHeader: {
      flexDirection: 'row', // Aligns children (icon and title) in a horizontal row
      alignItems: 'center', // Vertically centers the icon and title within the header
    },
    uvIconStyle: {
      width: 24,
      height: 24,
      marginRight: 5, // Provides a small gap between the icon and the text
    },
    uvIndexTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    uvIndexValue: {
      fontSize: 28,
      color: 'white',
      marginTop: 5, // Ensures it appears on a new line
      textAlign: 'center',
    },
    uvAdvice: {
      fontSize: 18,
      color: 'white',
      marginTop: 5,
      textAlign: 'center',
    },
    aqiContainer: {
      backgroundColor: 'rgba(128, 128, 128, 0.5)', // Background color with opacity
      padding: 10, // Padding inside the container
      borderRadius: 5, // Rounded corners
      alignItems: 'center', // Align items in the center vertically
      justifyContent: 'center', // Align items in the center horizontally
      marginLeft: 160, // Left margin to push it away from the previous container
      bottom: 100,
      paddingVertical: 5,
      paddingHorizontal: 10,
      maxHeight: 100,
    }, 
    dropdown: {
      backgroundColor: 'white', 
      borderColor: '#ccc', 
      borderWidth: 1,
      borderRadius: 10, 
      padding: 10,
      marginTop: 10, 
      width: '100%', 
      shadowColor: "#000", 
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      bottom: 80,
    },
    dropdownItem: {
      paddingVertical: 10, 
      paddingHorizontal: 15, 
      fontSize: 16, 
      color: '#333', 
      borderBottomWidth: 1, 
      borderBottomColor: '#e6e6e6', 
    },
    dropdownButton: {
      backgroundColor: '#007BFFAA',
      padding: 10,
      width: '100%',
      alignItems: 'center',
      borderRadius: 5,
      bottom:80,
    },
  });

export default ZipScreen;
