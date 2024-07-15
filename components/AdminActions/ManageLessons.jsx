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
      const response = await fetchLessons(chapter._id);
      setLessons(response.data);
    };
    fetchData();
  }, [chapter._id]);

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
      Alert.alert('Success', `${translations.lesson} deleted successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.lesson.toLowerCase()}`);
    }
  };

  const handleManageTopics = (lesson) => {
    navigation.navigate('ManageTopics', { lesson });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManageChapters', { plan: { _id: chapter.planId } })}>
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to {translations.chapter}s</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Manage {translations.lesson}s for {chapter.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddLesson}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add {translations.lesson}</Text>
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
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageLessons;
