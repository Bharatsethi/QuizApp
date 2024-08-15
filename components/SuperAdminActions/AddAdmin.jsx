import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { TranslationContext } from '../../context/TranslationContext';
import Header from '../General/Header';
import styles from '../General/styles';
import { createAdmin } from '../../services/api';

const AddAdmin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Logic to refresh the user list or perform necessary actions when the screen gains focus
    });

    return unsubscribe;
  }, [navigation]);

  const handleCreateAdmin = async () => {
    if (!username || !email || !password) {
      Alert.alert(translations.error, translations.fillAllFields || 'Please fill all fields');
      return;
    }

    try {
      await createAdmin({ username, email, password });
      Alert.alert(translations.success, `${translations.admin} ${translations.createdSuccessfully || 'created successfully'}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(translations.error, `Error creating ${translations.admin?.toLowerCase() || 'admin'} user`);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={[styles.card, styles.shadow]}>
        <Text style={styles.title}>{translations.addAdmin || 'Add Admin'}</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.username || 'Username'}:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={translations.enterUsername || 'Enter username'}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.email || 'Email'}:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={translations.enterEmail || 'Enter email'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{translations.password || 'Password'}:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={translations.enterPassword || 'Enter password'}
            secureTextEntry
          />
        </View>

        <View style={styles.superbuttonContainer}>
          <TouchableOpacity style={[styles.primaryButton, styles.shadow]} onPress={handleCreateAdmin}>
            <Text style={styles.buttonText}>{translations.create || 'Create'} {translations.admin || 'Admin'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cancelButton, styles.shadow]} onPress={handleCancel}>
            <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddAdmin;
