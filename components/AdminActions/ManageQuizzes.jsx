import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchQuizzes, deleteQuiz } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ManageQuizzes = ({ route, navigation }) => {
  const { topic } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchQuizzes(topic._id);
      setQuizzes(response.data);
    };
    fetchData();
  }, [topic._id]);

  const handleAddQuiz = () => {
    navigation.navigate('AddQuiz', { topicId: topic._id });
  };

  const handleEditQuiz = (quiz) => {
    navigation.navigate('EditQuiz', { quiz });
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
      Alert.alert('Success', `${translations.quiz} deleted successfully`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete ${translations.quiz}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ManageTopics', { lesson: topic.lesson })}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>Back to {translations.topics}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Manage {translations.quizzes} for {topic.title}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuiz}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add {translations.quiz}</Text>
      </TouchableOpacity>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.quizItem}>
            <Text style={styles.quizText}>{item.title}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditQuiz(item)}>
                <Icon name="pencil" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuiz(item._id)}>
                <Icon name="trash" size={20} color="#000" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageQuizzes;
