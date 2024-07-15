import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const UserProfile = ({ userId }) => {
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
        const response = await axios.get(`http://${API_URL}:3002/user/profile/${userId}`);
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        Alert.alert('Error', 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    try {
      await axios.put('http://${API_URL}:3002/user/profile', { userId, name, email, password });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while updating the profile');
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
              placeholder={`Enter your ${translations.username.toLowerCase()}`}
            />
            <Text style={styles.label}>{translations.email}:</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              placeholder={`Enter your ${translations.email.toLowerCase()}`}
              keyboardType="email-address"
            />
            <Text style={styles.label}>{translations.password}:</Text>
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword} 
              placeholder={`Enter your ${translations.password.toLowerCase()}`}
              secureTextEntry
            />
            <Button title="Update Profile" onPress={handleUpdateProfile} />
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;
