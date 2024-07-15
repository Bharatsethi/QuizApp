import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { login } from '../../services/api';
import Header from '../General/Header';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);

  // Function to get translation or default text
  const getTranslation = (key, defaultText) => translations[key] || defaultText;

  const handleLogin = async () => {
    console.log('Attempting to log in...');
    try {
      const response = await login({ email, password });
      console.log('Login response:', response);
      const { token } = response.data;
  
      let decoded;
      try {
        decoded = jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        Alert.alert(getTranslation('error', 'Error'), getTranslation('invalidToken', 'Invalid token'));
        return;
      }
  
      Alert.alert(getTranslation('success', 'Success'), getTranslation('loggedInSuccessfully', 'Logged in successfully'));
      if (decoded.role === 'superuser') {
        navigation.navigate('UserList');
      } else if (decoded.role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('PlanList');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 400) {
        Alert.alert(getTranslation('error', 'Error'), error.response.data.error);
      } else {
        Alert.alert(getTranslation('error', 'Error'), getTranslation('somethingWentWrong', 'Something went wrong'));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://i0.wp.com/poojabharat.com/wp-content/uploads/2020/06/logo.jpeg?fit=500%2C310&ssl=1' }}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>{getTranslation('welcomeMessage', 'Welcome to the world of transformation')}</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>{getTranslation('email', 'Email')}:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder={getTranslation('enterEmail', 'Enter your email')}
          keyboardType="email-address"
        />
        <Text style={styles.label}>{getTranslation('password', 'Password')}:</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder={getTranslation('enterPassword', 'Enter your password')}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Icon name="sign-in" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{getTranslation('login', 'Login')}</Text>
        </TouchableOpacity>
        <View style={styles.footerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>{getTranslation('register', 'Register')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.footerText}>{getTranslation('forgotPassword', 'Forgot Password')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
