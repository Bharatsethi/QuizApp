// ChapterList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { fetchChapters } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ChapterList = ({ route, navigation }) => {
  const { planId } = route.params;
  const [chapters, setChapters] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getChapters = async () => {
      try {
        const response = await fetchChapters(planId);
        setChapters(response.data);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        Alert.alert('Error', `Failed to fetch ${translations.chapter.toLowerCase()}s`);
      }
    };

    getChapters();
  }, [planId]);

  return (
    <View style={styles.container}>
      <Header />
      {chapters.map((chapter) => (
        <View key={chapter._id} style={styles.chapterItem}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterText}>{chapter.introduction}</Text>
          <Text style={styles.chapterText}>{chapter.overview}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LessonList', { chapterId: chapter._id })}
          >
            <Text style={styles.buttonText}>View {translations.lesson}s</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default ChapterList;
