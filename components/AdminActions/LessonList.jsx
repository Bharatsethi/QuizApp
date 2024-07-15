// LessonList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { fetchLessons } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const LessonList = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [lessons, setLessons] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getLessons = async () => {
      const response = await fetchLessons(chapterId);
      setLessons(response.data);
    };

    getLessons();
  }, [chapterId]);

  const renderLessonItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
      <Text style={styles.planText}>{item.content}</Text>
      <TouchableOpacity
        style={styles.button}
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
      {lessons.length === 0 ? (
        <Text style={styles.noPlansText}>No {translations.lesson.toLowerCase()}s found.</Text>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item._id}
          renderItem={renderLessonItem}
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
  );
};

export default LessonList;
