import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);
  const { setCurrentQuizId } = useContext(NavigationContext);

  const fetchData = async () => {
    try {
      const response = await fetchQuizzes(contextId);
      setQuizzes(response);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes. Please try again later.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [contextId, translations])
  );

  const handleAddQuiz = () => {
    navigation.navigate('AddQuiz', { contextId, contextType });
  };

  const handleEditQuiz = (quiz) => {
    navigation.navigate('EditQuiz', { quiz });
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteQuiz(quizId, user.userId);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
      Alert.alert(translations.success || 'Success', `${translations.quiz} ${translations.deletedSuccessfully || 'deleted successfully'}`);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      Alert.alert(translations.error || 'Error', `${translations.failedToDelete || 'Failed to delete'} ${translations.quiz.toLowerCase()}`);
    }
  };

  const handleManageQuestions = (quiz) => {
    setCurrentQuizId(quiz._id);
    navigation.navigate('ManageQuestions', { quizId: quiz._id, contextType: 'quiz' });
  };

  const handleLinkQuiz = async () => {
    try {
      const response = await fetchQuizzes();
      const availableQuizzes = response.filter((quiz) => !quizzes.some((q) => q._id === quiz._id));
      setAvailableQuizzes(availableQuizzes);
      setModalVisible(true);
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
    }
  };

  const linkSelectedQuiz = async (quizId) => {
    try {
      await linkQuizToContext(contextId, quizId, user.userId);
      setQuizzes([...quizzes, availableQuizzes.find((q) => q._id === quizId)]);
      Alert.alert(translations.success || 'Success', translations.quizLinkedSuccessfully || 'Quiz linked successfully');
      setModalVisible(false);
    } catch (error) {
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
          <FlatList
            data={availableQuizzes}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => linkSelectedQuiz(item._id)} style={styles.modalItem}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
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
      <Text style={styles.sectionTitle}>{translations.manage} {translations.quizzes} {translations.for} {contextType}</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuiz}>
        <Icon name="plus" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.addQuiz || 'Add Quiz'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleLinkQuiz}>
        <Icon name="link" size={16} color="#fff" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>{translations.link} {translations.quiz}</Text>
      </TouchableOpacity>
      {quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available for this plan.'}</Text>
      ) : (
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
                <TouchableOpacity onPress={() => handleManageQuestions(item)}>
                  <Icon name="book" size={20} color="#000" style={styles.icon} />
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
