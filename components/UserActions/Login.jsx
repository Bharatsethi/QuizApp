import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { login } from '../../services/api';
import Header from '../General/Header';
import jwt_decode from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/stylesOld';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);
  const { setUser } = useContext(UserContext);

  const getTranslation = (key, defaultText) => translations[key] || defaultText;

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      const { token } = response.data;

      let decoded;
      try {
        decoded = jwt_decode(token);
      } catch (error) {
        Alert.alert(getTranslation('error', 'Error'), getTranslation('invalidToken', 'Invalid token'));
        return;
      }

      // Save user details and token to UserContext
      await setUser({ token, ...decoded });
      console.log('Logged in user:', { token, ...decoded });

      // Navigate based on user role
      if (decoded.role === 'superuser') {
        console.log(decoded.role);
        navigation.navigate('UserList');
      } else if (decoded.role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('UserPlanList'); // Ensure this is correct
      }
    } catch (error) {
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
          style={styles.mainLogo}
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
