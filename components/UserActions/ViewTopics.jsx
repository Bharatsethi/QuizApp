import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchTopics } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';

const ViewTopics = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTopics(lessonId);
        setTopics(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch topics');
      }
    };

    fetchData();
  }, [lessonId]);

  const handleViewTopicContent = (topic) => {
    navigation.navigate('ViewTopicContent', { topic });
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewTopicContent(item)}>
            <View style={styles.topicItem}>
              <Text style={styles.topicText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ViewTopics;
