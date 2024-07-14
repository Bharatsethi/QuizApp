import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://192.168.0.75:3002/user/profile/${userId}`);
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put('http://192.168.0.75:3002/user/profile', { userId, name, email, password });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail} 
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput 
        style={styles.input} 
        value={password} 
        onChangeText={setPassword} 
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

export default UserProfile;
