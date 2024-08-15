import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchMessageById, updateMessage } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditMessage = ({ route, navigation }) => {
  const { messageId } = route.params;
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    setLoading(true);
    try {
      const response = await fetchMessageById(messageId);
      setMessageText(response.data.text);
    } catch (error) {
      console.error('Failed to fetch message:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchMessage || 'Failed to fetch message.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMessage = useCallback(async () => {
    if (messageText.trim() === '') {
      Alert.alert(translations.error || 'Error', translations.messageCannotBeEmpty || 'Message cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateMessage(messageId, { text: messageText });
      Alert.alert(translations.success || 'Success', translations.messageUpdatedSuccessfully || 'Message updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Failed to update message:', error);
      Alert.alert(translations.error || 'Error', translations.failedToUpdateMessage || 'Failed to update message.');
    } finally {
      setSaving(false);
    }
  }, [messageId, messageText, translations, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.back || 'Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations.editMessage || 'Edit Message'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder={translations.enterYourMessage || 'Enter your message'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveMessage} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{translations.save || 'Save'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={saving}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditMessage;
