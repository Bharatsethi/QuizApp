import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { forgotPassword } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { translations } = useContext(TranslationContext);

  const handleForgotPassword = async () => {
    try {
      await forgotPassword({ email });
      Alert.alert('Success', translations.passwordResetEmailSent);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', translations.passwordResetError);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.label}>{translations.email}:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={translations.enterEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>{translations.sendPasswordResetEmail}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;
