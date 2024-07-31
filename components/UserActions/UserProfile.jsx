import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/stylesOld';

const UserProfile = ({ route }) => {
  const { userId } = route.params;
  const { translations } = useContext(TranslationContext);
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://137.154.208.211:3002';

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/user/profile/${userId}`);
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        Alert.alert(translations.error, translations.failedToFetchUserProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, translations.error, translations.failedToFetchUserProfile]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(translations.error, translations.nameAndEmailRequired);
      return;
    }

    try {
      await axios.put(`${API_URL}/user/profile`, { userId, name, email, password });
      Alert.alert(translations.success, translations.profileUpdatedSuccessfully);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(translations.error, translations.failedToUpdateProfile);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.sectionContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.label}>{translations.username}:</Text>
            <TextInput 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholder={translations.enterYourUsername}
            />
            <Text style={styles.label}>{translations.email}:</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder={translations.enterYourEmail}
              keyboardType="email-address"
            />
            <Text style={styles.label}>{translations.password}:</Text>
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword} 
              placeholder={translations.enterYourPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>{translations.updateProfile}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;
