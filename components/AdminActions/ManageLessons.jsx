import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchLessons, deleteLesson } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ManageLessons = ({ route, navigation }) => {
  const { chapter } = route.params;
  const [lessons, setLessons] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLessons(chapter._id);
        setLessons(response.data);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchLessons || 'Failed to fetch lessons. Please try again later.');
      }
    };
    fetchData();
  }, [chapter._id, translations]);

  const handleAddLesson = () => {
    navigation.navigate('AddLesson', { chapterId: chapter._id });
  };

  const handleEditLesson = (lesson) => {
    navigation.navigate('EditLesson', { lesson });
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter(lesson => lesson._id !== lessonId));
      Alert.alert(translations.success || 'Success', `${translations.lesson} ${translations.deletedSuccessfully || 'deleted successfully'}`);
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToDelete || 'Failed to delete'} ${translations.lesson.toLowerCase()}`);
    }
  };

  const handleManageTopics = (lesson) => {
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
              <TouchableOpacity onPress={() => handleDeleteLesson(item._id)}>
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
