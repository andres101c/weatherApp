import React, { useState, useEffect } from 'react';
import {StatusBar, StyleSheet, Text, FlatList, View, SafeAreaView, TextInput, Button, TouchableOpacity} from 'react-native';
import { signOut } from '@firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from '@firebase/firestore';
import ZipItem from './ZipItem';

const API_KEY = '8158ea1b56e2497492b163654241204'; 


const AuthenticatedScreen = ({ navigation, route }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [zipCode, setZipCode] = useState('');
  const [zipCodes, setZipCodes] = useState([]);

  const {user, auth, app} = route.params; 

  const db = getFirestore(app); // Initialize Firestore

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zipCode}&days=7`);
      const data = await response.json();
      console.log('Weather Data:', data);
      setWeatherData(data);
      return data;
    } catch (error) {
      console.error('Weather API error:', error.message);
      return null;
    }
  };
  
  const handlePress = async () => {
    try {
      if (await fetchWeatherData()) {
        await handleSaveZipCode();
      } else {
        console.error('No weather data available.');
      }
    } catch (error) {
      console.error('Error handling press:', error);
    }


  };

  const handleSaveZipCode = async () => {
    const fetchWeather = await fetchWeatherData()
    try {
      if ( !fetchWeather.error ) {
        
        
        // Check to see if we already have zip added or is empty
        if ((zipCodes && zipCodes.some((item) => item.zipCode === zipCode)) || zipCode === '') {
          console.error('Invalid Zip Code');
          setZipCode('');
          return;
        }

        // Generate a unique ID for the new zip code
        const zipCodeItem = {
          id: Date.now().toString(), // Unique identifier
          zipCode: zipCode, // The zip code value
        };
  
        // Proceed with saving zip code if weather data is available
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userZipCodes = userData.zipCodes || [];
          const updatedZipCodes = [...userZipCodes, zipCodeItem];
          setZipCodes(updatedZipCodes);
          await setDoc(userDocRef, { zipCodes: updatedZipCodes }, { merge: true });
        } else {
          await setDoc(userDocRef, { zipCodes: [zipCodeItem] });
          setZipCodes([zipCodeItem]);
        }
        setZipCode('');
        console.log('Zip code saved successfully!');
      } else {
        console.error('Weather data is not available.');
        setZipCode('');
      }
    } catch (error) {
      console.error('Error saving zip code:', error);
      setZipCode('');

    }
  };
  
  const getZipCodes = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
          setZipCodes(userData.zipCodes);
          return userData.zipCodes;
      }  
    } catch (error) {
      console.error('Error getting zip code by user ID:', error);
      return null;
    }
  };

  const handleSearchZipCode = async (zip) => {
    navigation.navigate('ZipScreen', { zip });
  };

  const handleDeleteZipCode = async (id) => {
    try {
      // Remove the zip code from the database
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedZipCodes = userData.zipCodes.filter((zip) => zip.id !== id);
        await setDoc(userDocRef, { zipCodes: updatedZipCodes }, { merge: true });
        setZipCodes(updatedZipCodes);
        console.log('Zip code deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting zip code:', error);
    }
  };

  const handleEditZipCode = async (editedZip) => {
    const fetchWeather = await fetchWeatherData()
    try {
      if ( !fetchWeather.error ) {

      // Check to see if we already have zip added or is empty
      if ((zipCodes && zipCodes.some((item) => item.zipCode === zipCode)) || zipCode === '') {
        console.error('Invalid Zip Code');
        setZipCode('');
        return;
      }

      // Update the edited zip code in the database
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedZipCodes = userData.zipCodes.map((zip) => {
          if (zip.id === editedZip.id) {
            return {
              id: zip.id, // Unique identifier
              zipCode: zipCode, // The zip code value;
            };
          }
          return zip;
        });
        await setDoc(userDocRef, { zipCodes: updatedZipCodes }, { merge: true });
        setZipCodes(updatedZipCodes);
        setZipCode('');
        console.log('Zip code updated successfully!');
      }
    }
  } catch (error) {
    console.error('Error updating zip code:', error);
    setZipCode('');
  }
};

  useEffect(async () => {
    const fetchZipCodes = await getZipCodes();
    setZipCodes(fetchZipCodes);
  }, []);
  
  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
        navigation.navigate('AuthScreen'); // Navigate back to the login screen
      }
      
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };
  
  return (
      <View style={styles.authContainer}>
        <Text style={styles.title}>Welcome</Text>
        <SafeAreaView style={styles.container}>
          <Text style={styles.subtitle}>Enter Zip Code:</Text>
          <TextInput
            style={styles.input}
            value={String(zipCode)}
            onChangeText={(text) => setZipCode(text)}
            placeholder="Enter zip code"
            keyboardType="numeric"
          />
          <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handlePress} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Location</Text>
          </TouchableOpacity>
          </View>
          
          <StatusBar style="auto" />
          <FlatList
            data={zipCodes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ZipItem
                zip={item}
                onDelete={handleDeleteZipCode}
                onEdit={handleEditZipCode}
                onSearch={handleSearchZipCode}
              />
            )}
          />
        </SafeAreaView>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleAuthentication} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexgrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    marginBottom: 10

    
  },
  deleteButton: {
    backgroundColor: '#B30000',
    alignItems: 'center',

    padding: 5,
    borderRadius: 4,
    width: 100,
  },
  saveButton: {
    backgroundColor: 'green',
    alignItems: 'center',

    padding: 5,
    borderRadius: 4,
    width: 200,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
    
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  authContainer: {
    width: '100%',
    height: '100%',
    
    maxWidth: 400,
    backgroundColor: 'light gray',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold'
    
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold'
    
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    color: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 32,
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
