import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { TranslationContext } from '../../context/TranslationContext';
import Header from '../General/Header';
import styles from '../General/styles';

const AddAdmin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);
  const API_URL = 'http://137.154.208.211:3002';

  const handleCreateAdmin = async () => {
    try {
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
        <TouchableOpacity style={[styles.primaryButton, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddAdmin;
