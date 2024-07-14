import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://192.168.0.75:3002/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (selectedMessage) {
        await axios.put(`http://192.168.0.75:3002/admin/messages/${selectedMessage._id}`, { text });
        Alert.alert('Success', 'Message updated successfully');
      } else {
        await axios.post('http://192.168.0.75:3002/admin/messages', { text });
        Alert.alert('Success', 'Message created successfully');
      }
      setText('');
      setSelectedMessage(null);
      const response = await axios.get('http://192.168.0.75:3002/messages');
      setMessages(response.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = (message) => {
    setText(message.text);
    setSelectedMessage(message);
  };

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`http://192.168.0.75:3002/admin/messages/${messageId}`);
      Alert.alert('Success', 'Message deleted successfully');
      const response = await axios.get('http://192.168.0.75:3002/messages');
      setMessages(response.data);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Message:</Text>
      <TextInput 
        style={styles.input} 
        value={text} 
        onChangeText={setText} 
        placeholder="Enter your message"
      />
      <Button title={selectedMessage ? 'Update Message' : 'Create Message'} onPress={handleCreateOrUpdate} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>{item.text}</Text>
            <Button title="Edit" onPress={() => handleEdit(item)} />
            <Button title="Delete" onPress={() => handleDelete(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  messageItem: {
    marginBottom: 16,
  },
});

export default ManageMessages;
