import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const LessonList = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getLessons = async () => {
      try {
        const response = await fetchLessons(chapterId);
        setLessons(response.data);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchLessons || `Failed to fetch ${translations.lesson.toLowerCase()}s`);
      } finally {
        setLoading(false);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item._id}
          renderItem={renderLessonItem}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={<Text style={styles.emptyListText}>{translations.noLessons || `No ${translations.lesson.toLowerCase()}s found.`}</Text>}
        />
      )}
    </View>
  );
};

export default LessonList;
