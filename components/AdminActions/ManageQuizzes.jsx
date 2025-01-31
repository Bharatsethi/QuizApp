import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, Button, ActivityIndicator } from 'react-native';
import { fetchQuizzes, deleteQuiz, linkQuizToContext } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import { NavigationContext } from '../../context/NavigationContext';
import styles from '../General/styles';

const ManageQuizzes = ({ route, navigation }) => {
  const { contextId, contextType } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const { setCurrentQuizId } = useContext(NavigationContext);

  useEffect(() => {
    fetchData();
  }, [contextId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [contextId])
  );

  const fetchData = async () => {
    try {
      const response = await fetchQuizzes(contextId);
      if (response.status === 200) {
        setQuizzes(response.data);
      } else {
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleAddQuiz = () => {
    navigation.navigate('AddQuiz', { contextId, contextType });
  };

  const handleEditQuiz = (quiz) => {
    navigation.navigate('EditQuiz', { quiz });
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId, user.userId);
      if (response.status === 204) {
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        Alert.alert(translations.success || 'Success', translations.quizDeletedSuccessfully || 'Quiz deleted successfully');
      } else {
        throw new Error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      Alert.alert(translations.error || 'Error', translations.failedToDeleteQuiz || 'Failed to delete quiz');
    }
  };

  const handleManageQuestions = (quiz) => {
    setCurrentQuizId(quiz._id);
    navigation.navigate('ManageQuestions', { quizId: quiz._id, contextType: 'quiz' });
  };

  const handleLinkQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizzes(); // Fetch all quizzes to filter out already linked ones
      const nonLinkedQuizzes = response.data.filter(quiz => !quizzes.some(q => q._id === quiz._id));
      setAvailableQuizzes(nonLinkedQuizzes);
      setModalVisible(true);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const linkSelectedQuiz = async (quizId) => {
    try {
      const response = await linkQuizToContext(contextId, quizId, user.userId);
      if (response.status === 200) {
        setQuizzes([...quizzes, availableQuizzes.find(q => q._id === quizId)]);
        Alert.alert(translations.success || 'Success', translations.quizLinkedSuccessfully || 'Quiz linked successfully');
      } else {
        throw new Error('Failed to link quiz');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to link quiz:', error);
      Alert.alert(translations.error || 'Error', translations.failedToLinkQuiz || 'Failed to link quiz');
    }
  };

  const renderAvailableQuizzes = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translations.selectQuiz || 'Select Quiz'}</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#1E90FF" />
          ) : availableQuizzes.length === 0 ? (
            <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No available quizzes to link.'}</Text>
          ) : (
            <FlatList
              data={availableQuizzes}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => linkSelectedQuiz(item._id)} style={styles.modalItem}>
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <Button title={translations.cancel || 'Cancel'} onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonText}>{translations.backToManage || 'Back to Manage'}</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{translations.manage || 'Manage'} {translations.quizzes || 'Quizzes'} {translations.for || 'for'} {contextType}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuiz}>
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.addButtonText}>{translations.addQuiz || 'Add Quiz'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleLinkQuiz}>
        <Icon name="link" size={16} color="#fff" />
        <Text style={styles.addButtonText}>{translations.link || 'Link'} {translations.quiz || 'Quiz'}</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available for this context.'}</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.quizItem}>
              <Text style={styles.quizText}>{item.title}</Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEditQuiz(item)}>
                  <Icon name="pencil" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteQuiz(item._id)}>
                  <Icon name="trash" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleManageQuestions(item)}>
                  <Icon name="book" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.plansList}
        />
      )}
      {renderAvailableQuizzes()}
    </View>
  );
};

export default ManageQuizzes;
