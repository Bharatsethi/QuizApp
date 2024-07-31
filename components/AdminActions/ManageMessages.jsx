import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import MessageContext from '../../context/MessageContext';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/stylesOld';

const ManageMessages = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const { messages, setMessages } = useContext(MessageContext);
  const { translations } = useContext(TranslationContext);
  const API_URL = 'http://192.168.0.75:3002';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchMessages || 'Failed to fetch messages.');
    }
  };

  const handleCreateMessage = async () => {
    if (message.trim() === '') {
      Alert.alert(translations.error || 'Error', `${translations.message || 'Message'} ${translations.cannotBeEmpty || 'cannot be empty'}`);
      return;
    }

    try {
      await axios.post(`${API_URL}/admin/messages`, { text: message });
      Alert.alert(translations.success || 'Success', `${translations.message || 'Message'} ${translations.createdSuccessfully || 'created successfully'}`);
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Create message error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToCreate || 'Failed to create'} ${translations.message ? translations.message.toLowerCase() : 'message'}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/messages/${id}`);
      Alert.alert(translations.success || 'Success', `${translations.message || 'Message'} ${translations.deletedSuccessfully || 'deleted successfully'}`);
      fetchMessages();
    } catch (error) {
      console.error('Delete message error:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToDelete || 'Failed to delete'} ${translations.message ? translations.message.toLowerCase() : 'message'}`);
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.text}</Text>
      <TouchableOpacity onPress={() => handleDeleteMessage(item._id)}>
        <Icon name="trash" size={20} color="#ff0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>{translations.manage} {translations.messages || 'Messages'}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={translations.enterYourMessage || 'Enter your message'}
        />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.plansList}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreateMessage}>
          <Icon name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>{translations.save} {translations.message}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{translations.cancel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageMessages;
