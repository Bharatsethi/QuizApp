import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { login } from '../services/api';
import Header from './Header';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      Alert.alert('Success', 'Logged in successfully');
      navigation.navigate('PlanList');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.form}>
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
          secureTextEntry 
          placeholder="Enter your password"
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#1E90FF" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Register" onPress={() => navigation.navigate('Register')} color="#32CD32" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Forgot Password" onPress={() => navigation.navigate('ForgotPassword')} color="#FFA07A" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
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
  buttonContainer: {
    marginBottom: 16,
  },
});

export default Login;
