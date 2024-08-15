import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { fetchChapterDetails } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewChapters = ({ route, navigation }) => {
  const { chapterId } = route.params;
  const [chapterDetails, setChapterDetails] = useState(null);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadChapterDetails = async () => {
      try {
        const response = await fetchChapterDetails(chapterId);
        setChapterDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch chapter details:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchChapter || 'Failed to fetch chapter details. Please try again later.');
      }
    };

    loadChapterDetails();
  }, [chapterId, translations]);

  const renderLessonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.lessonItem}
      onPress={() => navigation.navigate('ViewLessons', { lessonId: item._id })}
    >
      <Text style={styles.lessonText}>{item.title}</Text>
      <Icon name="chevron-right" size={16} color="#1E90FF" />
    </TouchableOpacity>
  );

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => navigation.navigate('ViewQuiz', { quizId: item._id })}
    >
      <Text style={styles.quizText}>{item.title}</Text>
      <Icon name="chevron-right" size={16} color="#1E90FF" />
    </TouchableOpacity>
  );

  if (!chapterDetails) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.loadingText}>{translations.loading || 'Loading...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.title}>{chapterDetails.title}</Text>
        <Text style={styles.sectionTitle}>{translations.chapterIntroduction || 'Chapter Introduction'}</Text>
        <Text style={styles.contentText}>{chapterDetails.introduction}</Text>

        <Text style={styles.sectionTitle}>{translations.chapterContent || 'Chapter Content'}</Text>
        <Text style={styles.contentText}>{chapterDetails.content}</Text>

        <Text style={styles.sectionTitle}>{translations.lessons || 'Lessons'}</Text>
        {chapterDetails.lessons.length === 0 ? (
          <Text style={styles.noLessonsText}>{translations.noLessonsAvailable || 'No lessons available for this chapter.'}</Text>
        ) : (
          <FlatList
            data={chapterDetails.lessons}
            keyExtractor={(item) => item._id}
            renderItem={renderLessonItem}
            contentContainerStyle={styles.lessonsList}
          />
        )}

        <Text style={styles.sectionTitle}>{translations.quizzes || 'Quizzes'}</Text>
        {chapterDetails.quizzes.length === 0 ? (
          <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available for this chapter.'}</Text>
        ) : (
          <FlatList
            data={chapterDetails.quizzes}
            keyExtractor={(item) => item._id}
            renderItem={renderQuizItem}
            contentContainerStyle={styles.quizzesList}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ViewChapters;
