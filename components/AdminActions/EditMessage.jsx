import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { fetchMessageById, updateMessage } from '../../services/api'; // Assuming these functions are defined in your API service
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/stylesOld';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditMessage = ({ route, navigation }) => {
  const { messageId } = route.params;
  const [messageText, setMessageText] = useState('');
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    loadMessage();
  }, [messageId]);

  const loadMessage = async () => {
    try {
      const response = await fetchMessageById(messageId);
      setMessageText(response.data.text);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToFetchMessage || 'Failed to fetch message.');
    }
  };

  const handleSaveMessage = async () => {
    if (messageText.trim() === '') {
      Alert.alert(translations.error || 'Error', translations.messageCannotBeEmpty || 'Message cannot be empty.');
      return;
    }

    try {
      await updateMessage(messageId, { text: messageText });
      Alert.alert(translations.success || 'Success', translations.messageUpdatedSuccessfully || 'Message updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToUpdateMessage || 'Failed to update message.');
    }
  };

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
        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveMessage}>
          <Text style={styles.buttonText}>{translations.save || 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel || 'Cancel'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditMessage;
