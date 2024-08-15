import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import MessageContext from '../../context/MessageContext';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';
import { COLORS, API_URL } from '@env';

const ManageMessages = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { messages, setMessages } = useContext(MessageContext);
  const { translations } = useContext(TranslationContext);

  const apiClient = axios.create({
    baseURL: API_URL,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get('/admin/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      Alert.alert(translations.error, translations.failedToFetchMessages || 'Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (message.trim() === '') {
      Alert.alert(translations.error, `${translations.message} ${translations.cannotBeEmpty}`);
      return;
    }

    try {
      await apiClient.post('/admin/messages', { text: message.trim() });
      Alert.alert(translations.success, `${translations.message} ${translations.createdSuccessfully}`);
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Create message error:', error);
      Alert.alert(translations.error, `${translations.failedToCreate} ${translations.message.toLowerCase()}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await apiClient.delete(`/admin/messages/${id}`);
      Alert.alert(translations.success, `${translations.message} ${translations.deletedSuccessfully}`);
      fetchMessages();
    } catch (error) {
      console.error('Delete message error:', error);
      Alert.alert(translations.error, `${translations.failedToDelete} ${translations.message.toLowerCase()}`);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={[styles.planItem, styles.shadow]}>
      <Text style={styles.planText}>{item.text}</Text>
      <TouchableOpacity onPress={() => handleDeleteMessage(item._id)}>
        <Icon name="trash" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>{translations.manage} {translations.messages}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={translations.enterYourMessage}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          {messages.length > 0 ? (
            <FlatList
              data={messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
              keyExtractor={(item) => item._id}
              renderItem={renderMessageItem}
              contentContainerStyle={styles.plansList}
            />
          ) : (
            <Text style={styles.noMessagesText}>{translations.noMessagesAvailable || 'No messages available'}</Text>
          )}
        </>
      )}

      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity style={[styles.primaryButton, styles.shadow]} onPress={handleCreateMessage}>
          <Icon name="save" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>{translations.save} {translations.message}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cancelButton, styles.shadow]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageMessages;
