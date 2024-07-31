// LessonList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';

const LessonList = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getLessons = async () => {
      try {
        const response = await fetchLessons(chapterId);
        setLessons(response.data);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchLessons || `Failed to fetch ${translations.lesson.toLowerCase()}s`);
      }
    };

    getLessons();
  }, [chapterId, translations]);

  const renderLessonItem = ({ item }) => (
    <View style={styles.lessonItem}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text style={styles.lessonText}>{item.content}</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('TopicList', { lessonId: item._id })}
      >
        <Text style={styles.buttonText}>View {translations.topic}s</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>{translations.lesson}s</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.emptyListText}>No {translations.lesson.toLowerCase()}s found.</Text>}
      />
    </View>
  );
};

export default LessonList;
