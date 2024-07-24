import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { forgotPassword } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { translations } = useContext(TranslationContext);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert(translations.error, translations.enterValidEmail);
      return;
    }

    setLoading(true);
    
    try {
      await forgotPassword({ email });
      Alert.alert(translations.success, translations.passwordResetEmailSent);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(translations.error, translations.passwordResetError);
    } finally {
      setLoading(false);
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
        accessibilityLabel="Email Input"
      />
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleForgotPassword}>
              <Text style={styles.buttonText}>{translations.sendPasswordResetEmail}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>{translations.cancel}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default ForgotPassword;