// ManageMessages.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

const ManageMessages = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://192.168.0.75:3002/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleCreateMessage = async () => {
    if (message.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    try {
      await axios.post('http://192.168.0.75:3002/admin/messages', { text: message });
      Alert.alert('Success', 'Message created successfully');
      setMessage('');
      fetchMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to create message');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`http://192.168.0.75:3002/admin/messages/${id}`);
      Alert.alert('Success', 'Message deleted successfully');
      fetchMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.text}</Text>
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
      <Text style={styles.title}>Manage Messages</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter your message"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateMessage}>
        <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Create Message</Text>
      </TouchableOpacity>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
      />
      <TouchableOpacity style={styles.dashboardButton} onPress={handleGoToDashboard}>
        <Icon name="arrow-left" size={16} color="#fff" style={styles.dashboardButtonIcon} />
        <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  messageItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dashboardButtonIcon: {
    marginRight: 10,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageMessages;
