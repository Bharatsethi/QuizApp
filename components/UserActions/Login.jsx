import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { login } from '../../services/api';
import Header from '../General/Header';
import jwt_decode from 'jwt-decode';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      const { token } = response.data;

      let decoded;
      try {
        decoded = jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        Alert.alert('Error', 'Invalid token received');
        return;
      }

      Alert.alert('Success', 'Logged in successfully');
      if (decoded.role === 'superuser') {
        navigation.navigate('UserList');
      } else if (decoded.role === 'admin') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('PlanList');
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://i0.wp.com/poojabharat.com/wp-content/uploads/2020/06/logo.jpeg?fit=500%2C310&ssl=1' }}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Welcome to our Quiz App! Enjoy learning with our interactive quizzes.</Text>
      </View>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#32CD32' }]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FFA07A' }]} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.buttonText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
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
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;
