import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { fetchLessonDetails } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewLessons = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [lessonDetails, setLessonDetails] = useState(null);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadLessonDetails = async () => {
      try {
        const response = await fetchLessonDetails(lessonId);
        setLessonDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch lesson details:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchLesson || 'Failed to fetch lesson details. Please try again later.');
      }
    };

    loadLessonDetails();
  }, [lessonId, translations]);

  const renderTopicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.topicItem}
      onPress={() => navigation.navigate('ViewTopics', { topicId: item._id })}
    >
      <Text style={styles.topicText}>{item.title}</Text>
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

  if (!lessonDetails) {
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
        <Text style={styles.title}>{lessonDetails.title}</Text>
        <Text style={styles.sectionTitle}>{translations.lessonContent || 'Lesson Content'}</Text>
        <Text style={styles.contentText}>{lessonDetails.content}</Text>

        <Text style={styles.sectionTitle}>{translations.topics || 'Topics'}</Text>
        {lessonDetails.topics.length === 0 ? (
          <Text style={styles.noTopicsText}>{translations.noTopicsAvailable || 'No topics available for this lesson.'}</Text>
        ) : (
          <FlatList
            data={lessonDetails.topics}
            keyExtractor={(item) => item._id}
            renderItem={renderTopicItem}
            contentContainerStyle={styles.topicsList}
          />
        )}

        <Text style={styles.sectionTitle}>{translations.quizzes || 'Quizzes'}</Text>
        {lessonDetails.quizzes.length === 0 ? (
          <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available for this lesson.'}</Text>
        ) : (
          <FlatList
            data={lessonDetails.quizzes}
            keyExtractor={(item) => item._id}
            renderItem={renderQuizItem}
            contentContainerStyle={styles.quizzesList}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ViewLessons;
