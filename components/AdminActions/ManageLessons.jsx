import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLessons, deleteLesson } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext'; // Import NavigationContext

const ManageLessons = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [lessons, setLessons] = useState([]);
  const { currentChapterId, setCurrentChapterId, setCurrentLessonId } = useContext(NavigationContext);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (chapter) {
      setCurrentChapterId(chapter._id); // Set current chapter ID in context
    }
  }, [chapter, setCurrentChapterId]);

  const fetchData = async () => {
    try {
      const response = await fetchLessons(currentChapterId);
      setLessons(response.data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchLessons || 'Failed to fetch lessons. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentChapterId, translations])
  );

  const handleAddLesson = () => {
    navigation.navigate('AddLesson', { chapterId: currentChapterId });
  };

  const handleEditLesson = (lesson) => {
    navigation.navigate('EditLesson', { lesson });
  };

  const handleDeleteLesson = async (lessonId, action) => {
    try {
      await deleteLesson(lessonId, action, currentChapterId, user.userId); // Pass adminId from user context
      setLessons(lessons.filter(lesson => lesson._id !== lessonId));
      const successMessage = action === 'delete' ? translations.deletedSuccessfully : translations.unlinkedSuccessfully;
      Alert.alert(translations.success || 'Success', `${translations.lesson} ${successMessage || 'action completed successfully'}`);
    } catch (error) {
      console.error('Failed to process lesson:', error);
      const errorMessage = action === 'delete' ? translations.failedToDelete : translations.failedToUnlink;
      Alert.alert(translations.error || 'Error', `${errorMessage || 'Failed to process'} ${translations.lesson.toLowerCase()}`);
    }
  };

  const confirmDeleteOrUnlink = (lessonId) => {
    Alert.alert(
      translations.confirm || 'Confirm',
      translations.confirmDeleteOrUnlink || 'Do you want to delete the lesson or just unlink it from the chapter?',
      [
        {
          text: translations.delete || 'Delete',
          onPress: () => handleDeleteLesson(lessonId, 'delete'),
          style: 'destructive'
        },
        {
          text: translations.unlink || 'Unlink',
          onPress: () => handleDeleteLesson(lessonId, 'unlink')
        },
        {
          text: translations.cancel || 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleManageTopics = (lesson) => {
    setCurrentLessonId(lesson._id);
    navigation.navigate('ManageTopics', { lesson });
  };

  const handleManageQuizzes = (lesson) => {
    navigation.navigate('ManageQuizzes', { contextId: lesson._id, contextType: 'lesson' });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToChapters || 'Back to Chapters'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.lessons} {translations.for} {chapter.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddLesson}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.add} {translations.lesson}</Text>
      </TouchableOpacity>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditLesson(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDeleteOrUnlink(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleManageTopics(item)}>
                <Icon name="book" size={20} color="#000" style={styles.icon} />
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

export default ManageLessons;
