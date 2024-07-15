// ManageTranslations.jsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchTranslations, updateTranslations } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ManageTranslations = ({ navigation }) => {
  const { translations, setTranslationContext } = useContext(TranslationContext);
  const [translationsState, setTranslationsState] = useState(translations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetchTranslations();
        if (response.data) {
          setTranslationsState(response.data);
          setTranslationContext(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      } finally {
        setLoading(false);
      }
    };

    getTranslations();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTranslations(translationsState);
      Alert.alert('Success', 'Translations updated successfully');
      setTranslationContext(translationsState);
    } catch (error) {
      console.error('Failed to update translations:', error);
      Alert.alert('Error', 'Failed to update translations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!translationsState) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.errorText}>Failed to load translations</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Manage Translations</Text>
      {Object.keys(translationsState).map((key) => (
        <View key={key} style={styles.translationInputContainer}>
          <Text style={styles.label}>{key}:</Text>
          <TextInput
            style={styles.input}
            value={translationsState[key]}
            onChangeText={(text) => setTranslationsState({ ...translationsState, [key]: text })}
            placeholder={`Enter ${key} translation`}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Translations</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageTranslations;
