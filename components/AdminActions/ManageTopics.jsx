import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchTopics, deleteTopic } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ManageTopics = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [topics, setTopics] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTopics(lesson._id);
      setTopics(response.data);
    };
    fetchData();
  }, [lesson._id]);

  const handleAddTopic = () => {
    navigation.navigate('AddTopic', { lessonId: lesson._id });
  };

  const handleEditTopic = (topic) => {
    navigation.navigate('EditTopic', { topic });
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await deleteTopic(topicId);
      setTopics(topics.filter(topic => topic._id !== topicId));
      Alert.alert('Success', `${translations.topic} deleted successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.topic}`);
    }
  };

  const handleManageQuizzes = (topic) => {
    navigation.navigate('ManageQuizzes', { topic });
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ManageLessons', { chapter: lesson.chapter })}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to {translations.lessons}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Manage {translations.topics} for {lesson.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTopic}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add {translations.topic}</Text>
      </TouchableOpacity>
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.topicItem}>
            <Text style={styles.topicText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditTopic(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTopic(item._id)}>
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
