import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const EditUser = ({ route, navigation }) => {
  const { user } = route.params;
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);
  const API_URL = 'http://192.168.0.75:3002';

  const handleSave = async () => {
    try {
      const updatedUser = { username, email };
      if (password) {
        updatedUser.password = password;
      }
      console.log(`Updating user with ID: ${user._id} with data:`, updatedUser);
      await axios.put(`${API_URL}/superuser/users/${user._id}`, updatedUser);
      Alert.alert(translations.success, translations.userUpdatedSuccessfully);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || translations.somethingWentWrong;
      Alert.alert(translations.error, errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
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
      <Text style={styles.label}>{`${translations.password} (${translations.optional}):`}</Text>
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        placeholder={translations.enterPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{translations.save}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditUser;
