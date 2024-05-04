import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { initializeApp } from '@firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence, onAuthStateChanged } from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAVUe6aEZbDCHEtK3GKQ8z2krPtGCRn-pY",
  authDomain: "weather-app-a89c7.firebaseapp.com",
  projectId: "weather-app-a89c7",
  storageBucket: "weather-app-a89c7.appspot.com",
  messagingSenderId: "1032223150313",
  appId: "1:1032223150313:web:8d660be8d32a1d8b18e078",
  measurementId: "G-ZDJ2Z2D1ZR"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigation.navigate('AuthenticatedScreen', { user, auth, app });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('AuthenticatedScreen', { user, auth, app });
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate('AuthenticatedScreen', { user, auth, app });
      }
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setErrorMessage('Error: Invalid Credentials');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Username already exists.');
      } else {
        setErrorMessage('Invalid Username or Password.');
      }
      console.error('Authentication error:', error.message);
    }
  };
  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.authContainer}>
        <Text style={styles.title}>Weather App</Text>
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <View style={styles.buttonContainer}>
            <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#FFFFFF" />
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    bottom: 175,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: '#007BFFAA',
  },
  toggleText: {
    color: '#4a90e2',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 25,
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default AuthScreen;
