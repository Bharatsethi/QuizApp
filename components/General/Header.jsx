import React, { useEffect, useState, useContext } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import MessageContext from '../../context/MessageContext';
import headerStyles from './headerStyles';

const Header = () => {
  const { messages } = useContext(MessageContext);
  const [message, setMessage] = useState('Welcome to the world of transformation');

  useEffect(() => {
    if (messages.length > 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)].text;
      setMessage(randomMessage);
    }
  }, [messages]);

  return (
    <View style={headerStyles.headerContainer}>
      <Image 
        source={{ uri: 'https://i0.wp.com/poojabharat.com/wp-content/uploads/2020/06/logo.jpeg?fit=500%2C310&ssl=1' }}
        style={headerStyles.logo}
      />
      <View style={headerStyles.messageContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text style={headerStyles.scrollingMessage}>{message}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default Header;
