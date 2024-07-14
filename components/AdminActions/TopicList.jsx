import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { fetchTopics } from '../../services/api';
import Header from '../General/Header';

const TopicList = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const getTopics = async () => {
      const response = await fetchTopics(lessonId);
      setTopics(response.data);
    };

    getTopics();
  }, [lessonId]);

  return (
    <View>
        <Header />
      {topics.map((topic) => (
        <View key={topic._id}>
          <Text>{topic.title}</Text>
          <Text>{topic.content}</Text>
        </View>
      ))}
    </View>
  );
};

export default TopicList;
