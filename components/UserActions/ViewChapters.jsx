import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchChapters } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';

const ViewChapters = ({ route, navigation }) => {
  const { planId } = route.params;
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChapters(planId);
        setChapters(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch chapters');
      }
    };

    fetchData();
  }, [planId]);

  const handleViewLessons = (chapterId) => {
    navigation.navigate('ViewLessons', { chapterId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleViewLessons(item._id)}>
            <View style={styles.chapterItem}>
              <Text style={styles.chapterText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ViewChapters;
