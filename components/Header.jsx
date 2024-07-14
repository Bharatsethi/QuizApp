import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';

const Header = () => {
  const [message, setMessage] = useState('Welcome to the world of transformation');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://192.168.0.75:3002/messages');
        const messages = response.data;
        if (messages.length > 0) {
          const randomMessage = messages[Math.floor(Math.random() * messages.length)].text;
          setMessage(randomMessage);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Image 
        source={{ uri: 'https://i0.wp.com/poojabharat.com/wp-content/uploads/2020/06/logo.jpeg?fit=500%2C310&ssl=1' }}
        style={styles.logo}
      />
      <View style={styles.messageContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text style={styles.scrollingMessage}>{message}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
  },
  scrollingMessage: {
    fontSize: 16,
    color: '#333',
    width: Dimensions.get('window').width - 70,
  },
});

export default Header;
