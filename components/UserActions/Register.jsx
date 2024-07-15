import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity } from 'react-native';
import { register } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);

  const handleRegister = async () => {
    try {
      await register({ username, email, password });
      Alert.alert(translations.success, translations.userRegisteredSuccessfully);
      navigation.navigate('Login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert(translations.error, error.response.data.error);
      } else {
        Alert.alert(translations.error, translations.somethingWentWrong);
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
        <Text style={styles.welcomeText}>{translations.welcomeMessageRegister}</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>{translations.username}:</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder={translations.enterUsername}
        />
        <Text style={styles.label}>{translations.email}:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder={translations.enterEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>{translations.password}:</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder={translations.enterPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{translations.register}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.navigate('Login')}>
          <Icon name="arrow-left" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{translations.backToLogin}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
