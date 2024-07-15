import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import MessageContext from '../../context/MessageContext';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

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
      const response = await axios.get('http://192.168.0.75:3002/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages Manage Messages:', error);
    }
  };

  const handleCreateMessage = async () => {
    if (message.trim() === '') {
      Alert.alert('Error', `${translations.message} cannot be empty`);
      return;
    }

    try {
      await axios.post('http://${API_URL}:3002/admin/messages', { text: message });
      Alert.alert('Success', `${translations.message} created successfully`);
      setMessage('');
      fetchMessages();
    } catch (error) {
      Alert.alert('Error', `Failed to create ${translations.message.toLowerCase()}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`http://${API_URL}:3002/admin/messages/${id}`);
      Alert.alert('Success', `${translations.message} deleted successfully`);
      fetchMessages();
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.message.toLowerCase()}`);
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

  const handleGoToDashboard = () => {
    navigation.navigate('AdminDashboard');
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>Manage {translations.messages}</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder={`Enter your ${translations.message.toLowerCase()}`}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateMessage}>
        <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Create {translations.message}</Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.plansList}
      />
      <TouchableOpacity style={styles.backButton} onPress={handleGoToDashboard}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageMessages;
