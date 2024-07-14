import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { forgotPassword } from '../services/api';
import Header from './Header';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await forgotPassword({ email });
      alert('Password reset email sent');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
        <Header />
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Button title="Send Password Reset Email" onPress={handleForgotPassword} />
    </View>
  );
};

export default ForgotPassword;
