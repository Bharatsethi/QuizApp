import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchTopics, deleteTopic } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';
import { COLORS, FONTS } from '../General/colors';

const ManageTopics = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { currentLessonId, setCurrentLessonId, setCurrentTopicId } = useContext(NavigationContext);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (lesson) {
      setCurrentLessonId(lesson._id);
    }
  }, [lesson, setCurrentLessonId]);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetchTopics(currentLessonId);
      setTopics(response.data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      Alert.alert(translations.error, translations.failedToFetchTopics || 'Failed to fetch topics. Please try again later.');
    } finally {
      setLoading(false); // End loading
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
      Alert.alert(translations.success, `${translations.topic} ${successMessage}`);
    } catch (error) {
      console.error('Failed to process topic:', error);
      const errorMessage = action === 'delete' ? translations.failedToDelete : translations.failedToUnlink;
      Alert.alert(translations.error, `${errorMessage} ${translations.topic.toLowerCase()}`);
    }
  };

  const confirmDeleteOrUnlink = (topicId) => {
    Alert.alert(
      translations.confirm,
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
        <Icon name="arrow-left" size={16} color={COLORS.white} />
        <Text style={styles.backButtonText}>Back to {translations.lesson}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage} {translations.topics} {translations.for} {lesson.title}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.addButton, styles.shadow]} onPress={handleAddTopic}>
          <Icon name="plus" size={16} color={COLORS.white} />
          <Text style={styles.addButtonText}>{translations.add} {translations.topic}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : topics.length === 0 ? (
        <Text style={styles.noTopicsText}>{translations.noTopicsAvailable || 'No topics available for this lesson.'}</Text>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.topicItem, styles.shadow]}>
              <Text style={styles.topicText}>{item.title}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEditTopic(item)}>
                  <Icon name="pencil" size={20} color={COLORS.black} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteOrUnlink(item._id)}>
                  <Icon name="trash" size={20} color={COLORS.black} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleManageQuizzes(item)}>
                  <Icon name="question-circle" size={20} color={COLORS.black} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.topicsList}
        />
      )}
    </View>
  );
};

export default ManageTopics;
