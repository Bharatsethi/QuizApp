import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';

const ViewLessons = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLessons(chapterId);
        setLessons(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch lessons');
      }
    };

    fetchData();
  }, [chapterId]);

  const handleViewTopics = (lessonId) => {
    navigation.navigate('ViewTopics', { lessonId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewTopics(item._id)}>
            <View style={styles.lessonItem}>
              <Text style={styles.lessonText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ViewLessons;
