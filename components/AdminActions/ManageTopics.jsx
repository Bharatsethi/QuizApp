import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchTopics, deleteTopic } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';

const ManageTopics = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [topics, setTopics] = useState([]);
  const { currentLessonId, setCurrentLessonId, setCurrentTopicId } = useContext(NavigationContext);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (lesson) {
      setCurrentLessonId(lesson._id);
    }
  }, [lesson, setCurrentLessonId]);

  const fetchData = async () => {
    try {
      const response = await fetchTopics(currentLessonId);
      setTopics(response.data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchTopics || 'Failed to fetch topics. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentLessonId, translations])
  );

  const handleAddTopic = () => {
    navigation.navigate('AddTopic', { lessonId: currentLessonId });
  };

  const handleEditTopic = (topic) => {
    navigation.navigate('EditTopic', { topic });
  };

  const handleDeleteTopic = async (topicId, action) => {
    try {
      await deleteTopic(topicId, action, currentLessonId, user.userId);
      setTopics(topics.filter(topic => topic._id !== topicId));
      const successMessage = action === 'delete' ? translations.deletedSuccessfully : translations.unlinkedSuccessfully;
      Alert.alert(translations.success || 'Success', `${translations.topic} ${successMessage || 'action completed successfully'}`);
    } catch (error) {
      console.error('Failed to process topic:', error);
      const errorMessage = action === 'delete' ? translations.failedToDelete : translations.failedToUnlink;
      Alert.alert(translations.error || 'Error', `${errorMessage || 'Failed to process'} ${translations.topic.toLowerCase()}`);
    }
  };

  const confirmDeleteOrUnlink = (topicId) => {
    Alert.alert(
      translations.confirm || 'Confirm',
      translations.confirmDeleteOrUnlink || 'Do you want to delete the topic or just unlink it from the lesson?',
      [
        {
          text: translations.delete || 'Delete',
          onPress: () => handleDeleteTopic(topicId, 'delete'),
          style: 'destructive'
        },
        {
          text: translations.unlink || 'Unlink',
          onPress: () => handleDeleteTopic(topicId, 'unlink')
        },
        {
          text: translations.cancel || 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleManageQuizzes = (topic) => {
    setCurrentTopicId(topic._id);
    navigation.navigate('ManageQuizzes', { contextId: topic._id, contextType: 'topic' });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageLessons', { chapter: { _id: lesson.chapterId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToLessons || 'Back to Lessons'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.topics} {translations.for} {lesson.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTopic}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.add} {translations.topic}</Text>
      </TouchableOpacity>
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditTopic(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDeleteOrUnlink(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageQuizzes(item)}>
                <Icon name="question-circle" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageTopics;
