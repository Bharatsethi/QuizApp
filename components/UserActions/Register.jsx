import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { register } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { translations } = useContext(TranslationContext);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert(translations.error, translations.fillAllFields);
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password, role: 'regular' }); // Ensure role is set to 'regular'
      Alert.alert(translations.success, translations.userRegisteredSuccessfully);
      navigation.navigate('Login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert(translations.error, error.response.data.error);
      } else {
        Alert.alert(translations.error, translations.somethingWentWrong);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.form}>
        <Text style={styles.label}>{translations.username}:</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder={translations.enterUsername}
          accessibilityLabel="Username Input"
        />
        <Text style={styles.label}>{translations.email}:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder={translations.enterEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Email Input"
        />
        <Text style={styles.label}>{translations.password}:</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder={translations.enterPassword}
          accessibilityLabel="Password Input"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.superbuttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>{translations.register}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Login')}>
              <Icon name="arrow-left" size={16} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{translations.backToLogin}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Register;
