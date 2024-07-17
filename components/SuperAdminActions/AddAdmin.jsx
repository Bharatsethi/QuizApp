import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { TranslationContext } from '../../context/TranslationContext';
import Header from '../General/Header';
import styles from '../General/styles';

const AddAdmin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);
  const API_URL = 'http://192.168.0.75:3002';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Logic to refresh the user list or perform necessary actions when the screen gains focus
    });

    return unsubscribe;
  }, [navigation]);

  const handleCreateAdmin = async () => {
    if (!username || !email || !password) {
      Alert.alert(translations.error, translations.fillAllFields || 'Please fill all fields');
      return;
    }

    try {
      Alert.alert(`${API_URL}/superuser/admin`)
      await axios.post(`${API_URL}/superuser/admin`, { username, email, password });
      Alert.alert(translations.success, `${translations.admin} created successfully`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(translations.error, `Error creating ${translations.admin.toLowerCase()} user`);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={localStyles.form}>
        <Text style={styles.label}>{translations.username}:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder={`Enter ${translations.username.toLowerCase()}`}
        />
        <Text style={styles.label}>{translations.email}:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={`Enter ${translations.email.toLowerCase()}`}
          keyboardType="email-address"
        />
        <Text style={styles.label}>{translations.password}:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder={`Enter ${translations.password.toLowerCase()}`}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCreateAdmin}>
            <Text style={styles.buttonText}>{translations.create} {translations.admin}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>{translations.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  form: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  primaryButton: {
    ...styles.primaryButton,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    ...styles.cancelButton,
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: '#dc3545', // Ensure the cancel button is styled correctly
  },
});

export default AddAdmin;
