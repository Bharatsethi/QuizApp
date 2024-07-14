import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { register } from '../services/api';
import Header from './Header';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register({ username, email, password });
      Alert.alert('Success', 'User registraion successfully');
      navigation.navigate('Login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', 'User already exists');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View>
        <Header />
      <Text>Username:</Text>
      <TextInput value={username} onChangeText={setUsername} />
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
