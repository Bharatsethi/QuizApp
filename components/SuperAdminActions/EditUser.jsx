import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { TranslationContext } from '../../context/TranslationContext';
import Header from '../General/Header';
import styles from '../General/styles';
import { updateUser } from '../../services/api'; // Import the function from api.js

const EditUser = ({ route, navigation }) => {
  const { user } = route.params;
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);

  const handleSave = async () => {
    if (!username || !email) {
      Alert.alert(translations.error || 'Error', translations.fillAllFields || 'Please fill all fields');
      return;
    }

    try {
      const updatedUser = { username, email };
      if (password) {
        updatedUser.password = password;
      }
      await updateUser(user._id, updatedUser);
      Alert.alert(translations.success || 'Success', translations.userUpdatedSuccessfully || 'User updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || translations.somethingWentWrong || 'Something went wrong';
      Alert.alert(translations.error || 'Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.form}>
        <Text style={styles.label}>{translations.username || 'Username'}:</Text>
        <TextInput 
          style={styles.input} 
          value={username} 
          onChangeText={setUsername} 
          placeholder={translations.enterUsername || 'Enter username'}
        />
        <Text style={styles.label}>{translations.email || 'Email'}:</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder={translations.enterEmail || 'Enter email'}
          keyboardType="email-address"
        />
        <Text style={styles.label}>{`${translations.password || 'Password'} (${translations.optional || 'Optional'}):`}</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          placeholder={translations.enterPassword || 'Enter password'}
          secureTextEntry
        />
        <View style={styles.superbuttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{translations.save || 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditUser;
