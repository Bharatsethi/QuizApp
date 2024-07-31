import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { fetchTranslations, updateTranslations } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const ManageTranslations = ({ navigation }) => {
  const { translations, setTranslationContext } = useContext(TranslationContext);
  const [translationsState, setTranslationsState] = useState(translations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetchTranslations();
        if (response.data && response.data.length > 0) {
          console.log('Fetched translations:', response.data[0]); // Debug statement
          setTranslationsState(response.data[0]);
          setTranslationContext(response.data[0]);
        } else {
          console.error('No translations found in response:', response);
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchTranslations || 'Failed to fetch translations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getTranslations();
  }, [setTranslationContext, translations.error, translations.failedToFetchTranslations]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTranslations(translationsState);
      Alert.alert(translations.success || 'Success', translations.translationsUpdatedSuccessfully || 'Translations updated successfully');
      setTranslationContext(translationsState);
    } catch (error) {
      console.error('Failed to update translations:', error);
      Alert.alert(translations.error || 'Error', translations.failedToUpdateTranslations || 'Failed to update translations. Please try again later.');
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
        <Text style={styles.errorText}>{translations.failedToLoadTranslations || 'Failed to load translations'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>Manage {translations.translations || 'Translations'}</Text>
      <View style={styles.gridContainer}>
        {Object.keys(translationsState).map((key) => (
          <View key={key} style={styles.gridItem}>
            <Text style={styles.label}>{key}:</Text>
            <TextInput
              style={styles.input}
              value={translationsState[key]}
              onChangeText={(text) => setTranslationsState({ ...translationsState, [key]: text })}
              placeholder={`Enter ${key} translation`}
            />
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{translations.saveTranslation || 'Save Translations'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cancelButton, styles.backButton]} onPress={() => navigation.navigate('AdminDashboard')}>
          <Icon name="arrow-left" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{translations.backToDashboard || 'Back to Dashboard'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ManageTranslations;
