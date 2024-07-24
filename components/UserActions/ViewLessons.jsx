import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ViewLessons = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLessons(chapterId);
        setLessons(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchLessons);
      }
    };

    fetchData();
  }, [chapterId, translations.error, translations.failedToFetchLessons]);

  const handleViewTopics = (lessonId) => {
    navigation.navigate('ViewTopics', { lessonId });
  };

  const renderLessonItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewTopics(item._id)}>
      <View style={styles.lessonItem}>
        <Text style={styles.lessonText}>{item.title}</Text>
        <Text style={styles.lessonDescription}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.noItemsText}>{translations.noLessons}</Text>}
      />
    </View>
  );
};

export default ViewLessons;
